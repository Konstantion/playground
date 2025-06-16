import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { authenticatedReq } from '@/utils/Requester';
import { Endpoints } from '@/utils/Endpoints';
import { ErrorType } from '@/utils/ErrorType';
import { toast } from 'sonner';
import { RHome } from '@/rout/Routes';
import Loading from '@/components/Loading';
import NotFound from '@/components/NotFound';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ChevronLeft, ChevronRight, Send, Timer } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const UserTestStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

const QuestionType = {
    SINGLE_CHOICE: 'SINGLE_CHOICE',
    MULTIPLE_CHOICE: 'MULTIPLE_CHOICE',
};

const getQuestionType = questionMetadata => {
    if (!questionMetadata || !questionMetadata.correctAnswers) {
        return QuestionType.SINGLE_CHOICE;
    }
    return questionMetadata.correctAnswers.length > 1
        ? QuestionType.MULTIPLE_CHOICE
        : QuestionType.SINGLE_CHOICE;
};

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export default function TestTakingPage() {
    const { userTestId } = useParams();
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const [testData, setTestData] = useState(null);
    const [status, setStatus] = useState('loading');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(null);
    const timerIntervalRef = useRef(null);
    const handleSubmitRef = useRef(null);

    const handleTopLeftButtonClick = useCallback(() => {
        navigate(`${RHome}/Tests`);
    }, [navigate, RHome]);

    const handleSubmit = useCallback(
        async (isAutoSubmit = false) => {
            const currentStatus = status;
            const currentTestData = testData;

            if (
                currentStatus !== 'loaded' ||
                !currentTestData ||
                currentTestData.status !== UserTestStatus.IN_PROGRESS
            ) {
                if (!isAutoSubmit && currentStatus !== 'submitting') {
                    toast.warning('Cannot submit test at this time.', { duration: 3000 });
                }
                return;
            }

            setStatus('submitting');
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }

            await authenticatedReq(
                `${Endpoints.UserTest.Base}/submit`,
                'POST',
                {
                    testId: userTestId,
                    answers: userAnswers,
                },
                auth.accessToken,
                (type, msg) => {
                    setStatus('loaded');
                    toast.error(`Submission failed: ${msg || 'Unknown error'}`, {
                        duration: 5000,
                        closeButton: true,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                    }
                },
                completedTestData => {
                    setStatus('completed');
                    setTestData(completedTestData);
                    toast.success(
                        `Test submitted successfully! Your score: ${completedTestData.score?.toFixed(1) ?? 'N/A'}%`,
                        { duration: 10000, closeButton: true }
                    );
                }
            );
        },
        [
            userTestId,
            userAnswers,
            auth.accessToken,
            logout,
            status,
            testData,
            navigate,
            RHome,
            setStatus,
            setTestData,
        ]
    );

    useEffect(() => {
        handleSubmitRef.current = handleSubmit;
    }, [handleSubmit]);

    const startTimer = useCallback(
        (startTimeMillis, endTimeMillis) => {
            if (!endTimeMillis || !startTimeMillis) {
                setTimeLeft(null);
                return;
            }

            const now = Date.now();
            const initialTimeLeft = Math.max(0, Math.floor((endTimeMillis - now) / 1000));
            setTimeLeft(initialTimeLeft);

            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
            }

            if (initialTimeLeft <= 0) {
                toast.error("Time's up! Submitting your answers automatically.", {
                    duration: 5000,
                });
                if (handleSubmitRef.current) {
                    handleSubmitRef.current(true);
                }
                return;
            }

            timerIntervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === null || prevTime <= 1) {
                        clearInterval(timerIntervalRef.current);
                        timerIntervalRef.current = null;
                        toast.error("Time's up! Submitting your answers automatically.", {
                            duration: 5000,
                        });
                        if (handleSubmitRef.current) {
                            handleSubmitRef.current(true);
                        }
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        },
        [setTimeLeft /* handleSubmitRef is used via .current, toast is stable */]
    );

    useEffect(() => {
        if (!userTestId) {
            setStatus('error');
            toast.error('Invalid Test Attempt ID.');
            navigate(`${RHome}/Tests`);
            return;
        }
        let isMounted = true;

        const fetchTestData = async () => {
            setStatus('loading');
            await authenticatedReq(
                `${Endpoints.UserTest.Base}/${userTestId}/take`,
                'GET',
                null,
                auth.accessToken,
                (type, msg) => {
                    if (!isMounted) return;
                    setStatus('error');
                    toast.error(`Failed to load test: ${msg || 'Unknown error'}`, {
                        duration: 4000,
                    });
                    if (type === ErrorType.TokenExpired) logout();
                },
                data => {
                    if (!isMounted) return;

                    if (data.status !== UserTestStatus.IN_PROGRESS) {
                        setStatus('error');
                        const message =
                            data.status === UserTestStatus.NOT_STARTED
                                ? "Test not started. Please start it from 'My Tests'."
                                : data.status === UserTestStatus.COMPLETED
                                  ? 'This test has already been completed.'
                                  : `Cannot take test. Status: ${data.status}`;
                        toast.error(message, { duration: 5000 });
                        navigate(`${RHome}/Tests`);
                        return;
                    }

                    let processedData = { ...data };
                    if (processedData.testMetadata && processedData.testMetadata.questionMetadata) {
                        const shouldShuffle = processedData.shuffleVariants === true;
                        processedData.testMetadata = {
                            ...processedData.testMetadata,
                            questionMetadata: processedData.testMetadata.questionMetadata.map(
                                qm => {
                                    const correct = Array.isArray(qm.correctAnswers)
                                        ? qm.correctAnswers
                                        : [];
                                    const incorrect = Array.isArray(qm.incorrectAnswers)
                                        ? qm.incorrectAnswers
                                        : [];
                                    let combinedAnswers = [...correct, ...incorrect];
                                    if (shouldShuffle) {
                                        combinedAnswers = shuffleArray(combinedAnswers);
                                    }
                                    return { ...qm, _shuffledAnswers: combinedAnswers };
                                }
                            ),
                        };
                    }

                    setTestData(processedData);
                    setStatus('loaded');
                    setUserAnswers(
                        processedData.questionAnswers?.reduce((acc, qa) => {
                            acc[qa.questionMetadataId] = qa.answerIds || [];
                            return acc;
                        }, {}) || {}
                    );
                    setCurrentQuestionIndex(0);

                    if (processedData.startedAt && processedData.immutableTest?.expiresAfter) {
                        startTimer(
                            processedData.startedAt,
                            processedData.immutableTest.expiresAfter
                        );
                    } else {
                        setTimeLeft(null);
                    }
                }
            );
        };

        fetchTestData();

        return () => {
            isMounted = false;
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
        };
    }, [userTestId, auth.accessToken, logout, navigate, RHome, startTimer, setTimeLeft]);

    const handleAnswerChange = (questionMetadataId, answerId, isChecked) => {
        const currentQuestionMeta =
            testData?.testMetadata?.questionMetadata?.[currentQuestionIndex];
        if (!currentQuestionMeta) return;

        const questionType = getQuestionType(currentQuestionMeta);

        setUserAnswers(prevAnswers => {
            const currentAnswersForQuestion = prevAnswers[questionMetadataId] || [];
            let newAnswersForQuestion;

            if (questionType === QuestionType.SINGLE_CHOICE) {
                newAnswersForQuestion = [answerId];
            } else {
                if (isChecked) {
                    newAnswersForQuestion = [...new Set([...currentAnswersForQuestion, answerId])];
                } else {
                    newAnswersForQuestion = currentAnswersForQuestion.filter(id => id !== answerId);
                }
            }
            return {
                ...prevAnswers,
                [questionMetadataId]: newAnswersForQuestion,
            };
        });
    };

    const goToNext = () => {
        if (currentQuestionIndex < (testData?.testMetadata?.questionMetadata?.length || 0) - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const goToPrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    if (status === 'loading') return <Loading message="Loading test..." />;
    if (status === 'error' || (!testData && status !== 'loading')) {
        return <NotFound message="Could not load the test data." />;
    }

    if (status === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-4 sm:p-6">
                <Card className="w-full max-w-md text-center shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 p-6 sm:p-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold mb-2 dark:text-slate-100">
                        Test Completed!
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 mb-6">
                        Your score has been recorded.
                    </CardDescription>
                    <div className="text-4xl font-bold text-sky-600 dark:text-sky-400 mb-6">
                        {testData?.score?.toFixed(1) ?? 'N/A'}%
                    </div>
                    <Button onClick={() => navigate(`${RHome}/Tests`)} className="w-full">
                        Back to My Tests
                    </Button>
                </Card>
            </div>
        );
    }

    if (!testData || !testData.testMetadata?.questionMetadata) {
        if (status === 'loaded') {
            console.error('Test data is loaded but critical metadata is missing.', testData);
            return (
                <NotFound message="Test content is currently unavailable. Please try again later." />
            );
        }

        return <Loading message="Preparing test..." />;
    }

    const currentQuestionMeta = testData.testMetadata.questionMetadata[currentQuestionIndex];

    if (!currentQuestionMeta) {
        console.error(
            'Error: Could not find current question metadata at index',
            currentQuestionIndex,
            testData
        );

        if (currentQuestionIndex !== 0 && testData.testMetadata.questionMetadata.length > 0) {
            setCurrentQuestionIndex(0);
        }
        return <NotFound message="Error loading current question. Please try refreshing." />;
    }

    const allAnswers = currentQuestionMeta._shuffledAnswers || [];
    const questionType = getQuestionType(currentQuestionMeta);
    const selectedAnswersSet = new Set(userAnswers[currentQuestionMeta.id] || []);
    const totalQuestions = testData.testMetadata.questionMetadata.length || 0;
    const progressValue =
        totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

    const formatTime = seconds => {
        if (seconds === null || seconds < 0) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 font-sans">
            <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-md px-4 sm:px-6 py-3 border-b dark:border-slate-700">
                <div className="flex justify-between items-center max-w-5xl mx-auto">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleTopLeftButtonClick}
                            aria-label="Back to tests"
                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1
                            className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[200px] sm:max-w-xs md:max-w-md lg:max-w-lg"
                            title={testData.testMetadata?.name}
                        >
                            {testData.testMetadata?.name || 'Test'}
                        </h1>
                    </div>
                    {timeLeft !== null && (
                        <div
                            className={`flex items-center space-x-2 text-sm font-medium ${timeLeft <= 60 && timeLeft > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : timeLeft === 0 ? 'text-red-700 dark:text-red-500' : 'text-slate-700 dark:text-slate-300'}`}
                        >
                            <Timer className="h-5 w-5" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>
                {totalQuestions > 0 && <Progress value={progressValue} className="mt-2 h-1.5" />}
            </header>

            <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <Card className="shadow-lg rounded-lg dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        {totalQuestions > 0 && (
                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                Question {currentQuestionIndex + 1} of {totalQuestions}
                            </CardDescription>
                        )}
                        <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-50 leading-relaxed mt-1">
                            {currentQuestionMeta.text || 'Question text not available.'}
                        </CardTitle>

                        {currentQuestionMeta.formatAndCode?.code && (
                            <div
                                className="mt-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md text-sm border dark:border-slate-600"
                                style={{ userSelect: 'none' }}
                            >
                                <pre className="whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
                                    <code>{currentQuestionMeta.formatAndCode.code}</code>
                                </pre>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="pt-2 pb-6">
                        {allAnswers.length === 0 && (
                            <p className="text-slate-500 dark:text-slate-400">
                                No answer options available for this question.
                            </p>
                        )}
                        {questionType === QuestionType.SINGLE_CHOICE ? (
                            <RadioGroup
                                value={selectedAnswersSet.values().next().value || ''}
                                onValueChange={value =>
                                    handleAnswerChange(currentQuestionMeta.id, value, true)
                                }
                                className="space-y-3"
                                disabled={status === 'submitting'}
                            >
                                {allAnswers.map((answer, index) => (
                                    <div
                                        key={answer.id || `ans-${index}-${currentQuestionIndex}`}
                                        className="flex items-center space-x-3 p-3.5 border dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors duration-150 ease-in-out"
                                    >
                                        <RadioGroupItem
                                            value={answer.id}
                                            id={`q${currentQuestionIndex}-a${answer.id}`}
                                            disabled={status === 'submitting'}
                                        />
                                        <Label
                                            htmlFor={`q${currentQuestionIndex}-a${answer.id}`}
                                            className="font-normal cursor-pointer flex-1 text-slate-800 dark:text-slate-200"
                                        >
                                            {answer.answer}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <div className="space-y-3">
                                {allAnswers.map((answer, index) => (
                                    <div
                                        key={answer.id || `ans-${index}-${currentQuestionIndex}`}
                                        className="flex items-center space-x-3 p-3.5 border dark:border-slate-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors duration-150 ease-in-out"
                                    >
                                        <Checkbox
                                            id={`q${currentQuestionIndex}-a${answer.id}`}
                                            checked={selectedAnswersSet.has(answer.id)}
                                            onCheckedChange={checked =>
                                                handleAnswerChange(
                                                    currentQuestionMeta.id,
                                                    answer.id,
                                                    !!checked
                                                )
                                            }
                                            disabled={status === 'submitting'}
                                        />
                                        <Label
                                            htmlFor={`q${currentQuestionIndex}-a${answer.id}`}
                                            className="font-normal cursor-pointer flex-1 text-slate-800 dark:text-slate-200"
                                        >
                                            {answer.answer}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center pt-6 border-t dark:border-slate-700/50">
                        <Button
                            variant="outline"
                            onClick={goToPrev}
                            disabled={currentQuestionIndex === 0 || status === 'submitting'}
                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="mr-1.5 h-4 w-4" /> Previous
                        </Button>

                        {currentQuestionIndex < totalQuestions - 1 ? (
                            <Button
                                onClick={goToNext}
                                disabled={status === 'submitting'}
                                className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                            >
                                Next <ChevronRight className="ml-1.5 h-4 w-4" />
                            </Button>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        disabled={
                                            status === 'submitting' ||
                                            Object.keys(userAnswers).length === 0
                                        }
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                                    >
                                        {status === 'submitting' ? 'Submitting...' : 'Submit Test'}
                                        <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="dark:bg-slate-800 rounded-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle className="dark:text-slate-100">
                                            Confirm Submission
                                        </AlertDialogTitle>
                                        <AlertDialogDescription className="dark:text-slate-400">
                                            Are you sure you want to submit your answers? You won't
                                            be able to change them afterwards.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">
                                            Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                handleSubmitRef.current &&
                                                handleSubmitRef.current(false)
                                            }
                                            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                                        >
                                            Confirm Submit
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
