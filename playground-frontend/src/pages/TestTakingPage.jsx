import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth';
import {authenticatedReq} from '@/utils/Requester';
import {Endpoints} from '@/utils/Endpoints';
import {ErrorType} from '@/utils/ErrorType';
import {toast} from 'sonner';
import {RHome} from '@/rout/Routes'; // Import RHome
import Loading from '@/components/Loading';
import NotFound from '@/components/NotFound';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@/components/ui/card';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Checkbox} from '@/components/ui/checkbox';
import {Label} from '@/components/ui/label';
import {Progress} from '@/components/ui/progress';
import {CheckCircle, ChevronLeft, ChevronRight, Send, Timer,} from 'lucide-react';
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

// Define Status constants matching backend enum
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

    // NEW: Callback for the top-left button
    const handleTopLeftButtonClick = useCallback(() => {
        navigate(`${RHome}/Tests`);
    }, [navigate, RHome, userTestId]); // Add dependencies used within the callback

    // Submission handler (memoized)
    const handleSubmit = useCallback(
        async (isAutoSubmit = false) => {
            // Prevent double submission or submitting if not in progress
            if (
                status !== 'loaded' ||
                !testData ||
                testData.status !== UserTestStatus.IN_PROGRESS
            ) {
                if (!isAutoSubmit) {
                    // Don't show toast for auto-submit if already completed/error
                    toast.warning('Cannot submit test at this time.', { duration: 3000 });
                }
                return;
            }

            setStatus('submitting'); // Set submitting state
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); // Stop timer

            await authenticatedReq(
                `${Endpoints.UserTest.Base}/submit`,
                'POST',
                {
                    testId: userTestId,
                    answers: userAnswers,
                },
                auth.accessToken,
                (type, msg) => {
                    setStatus('loaded'); // Revert status to allow retry? Or set to 'error'? Let's allow retry.
                    toast.error(`Submission failed: ${msg || 'Unknown error'}`, {
                        duration: 5000,
                        closeButton: true,
                    });
                    if (type === ErrorType.TokenExpired) logout();
                    // Consider restarting timer if appropriate and time hasn't run out
                },
                completedTestData => {
                    setStatus('completed');
                    setTestData(completedTestData);
                    toast.success(
                        `Test submitted successfully! Your score: ${completedTestData.score?.toFixed(1) ?? 'N/A'}%`,
                        { duration: 10000 }
                    );
                }
            );
        },
        [userTestId, userAnswers, auth.accessToken, logout, status, testData]
    ); // Include status and testData

    // Timer logic (memoized)
    const startTimer = useCallback(
        (startTimeMillis, endTimeMillis) => {
            if (!endTimeMillis || !startTimeMillis) return;

            const now = Date.now();
            // Calculate remaining time based on absolute end time and current time
            const initialTimeLeft = Math.max(0, Math.floor((endTimeMillis - now) / 1000));
            setTimeLeft(initialTimeLeft);

            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

            timerIntervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => {
                    if (prevTime === null || prevTime <= 1) {
                        clearInterval(timerIntervalRef.current);
                        toast.error("Time's up! Submitting your answers automatically.", {
                            duration: 5000,
                        });
                        handleSubmit(true); // Auto-submit
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        },
        [handleSubmit]
    ); // Depend only on handleSubmit

    // Fetch Test Data Effect
    useEffect(() => {
        if (!userTestId) {
            setStatus('error');
            toast.error('Invalid Test Attempt ID.');
            navigate(`${RHome}/Tests`); // Redirect if ID is missing
            return;
        }
        let isMounted = true; // Flag to prevent state updates on unmounted component

        const fetchTestData = async () => {
            setStatus('loading');
            await authenticatedReq(
                `${Endpoints.UserTest.Base}/${userTestId}/take`,
                'GET',
                null,
                auth.accessToken,
                (type, msg) => {
                    if (!isMounted) return; // Don't update state if unmounted
                    setStatus('error');
                    toast.error(`Failed to load test: ${msg || 'Unknown error'}`, {
                        duration: 4000,
                    });
                    if (type === ErrorType.TokenExpired) logout();
                },
                data => {
                    if (!isMounted) return; // Don't update state if unmounted

                    // Validate fetched data status
                    if (data.status !== UserTestStatus.IN_PROGRESS) {
                        setStatus('error');
                        const message =
                            data.status === UserTestStatus.NOT_STARTED
                                ? "Test not started. Please start it from 'My Tests'."
                                : `Cannot take test. Status: ${data.status}`;
                        toast.error(message, { duration: 5000 });
                        navigate(`${RHome}/Tests`); // Redirect back to list
                        return;
                    }

                    setTestData(data);
                    setStatus('loaded');
                    setUserAnswers({}); // Reset answers when loading a test
                    setCurrentQuestionIndex(0);

                    // Start timer only if expiresAfter is present (absolute timestamp)
                    // And startedAt is also present (should be if IN_PROGRESS)
                    if (data.startedAt && data.immutableTest?.expiresAfter) {
                        startTimer(data.startedAt, data.immutableTest.expiresAfter);
                    } else {
                        setTimeLeft(null); // No time limit
                    }
                }
            );
        };

        fetchTestData();

        // Cleanup function
        return () => {
            isMounted = false; // Set flag when component unmounts
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current); // Clear timer on unmount
            }
        };
        // **CRITICAL FIX**: Removed startTimer from dependencies
    }, [userTestId, auth.accessToken, logout, navigate]); // Only depend on things that trigger a refetch

    // Cleanup timer specifically when component unmounts (redundant but safe)
    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        };
    }, []);

    // --- Answer Handling ---
    const handleAnswerChange = (questionMetadataId, answerId, isChecked) => {
        const currentQuestionMeta =
            testData?.testMetadata?.questionMetadata?.[currentQuestionIndex];
        if (!currentQuestionMeta) return; // Should not happen if loaded

        const questionType = getQuestionType(currentQuestionMeta);

        setUserAnswers(prevAnswers => {
            const currentAnswers = prevAnswers[questionMetadataId] || [];
            let newAnswers;

            if (questionType === QuestionType.SINGLE_CHOICE) {
                newAnswers = [answerId];
            } else {
                // MULTIPLE_CHOICE
                if (isChecked) {
                    newAnswers = [...new Set([...currentAnswers, answerId])];
                } else {
                    newAnswers = currentAnswers.filter(id => id !== answerId);
                }
            }

            return {
                ...prevAnswers,
                [questionMetadataId]: newAnswers,
            };
        });
    };

    // --- Navigation ---
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

    // --- Rendering Logic ---
    if (status === 'loading') return <Loading message="Loading test..." />;
    if (status === 'error' || !testData) return <NotFound message="Could not load the test." />;

    // --- Completed View ---
    if (status === 'completed') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 p-6">
                <Card className="w-full max-w-md text-center shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 p-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <CardTitle className="text-2xl font-bold mb-2 dark:text-slate-100">
                        Test Completed!
                    </CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400 mb-6">
                        Your score has been recorded.
                    </CardDescription>
                    <div className="text-4xl font-bold text-sky-600 dark:text-sky-400 mb-6">
                        {testData.score?.toFixed(1) ?? 'N/A'}%
                    </div>
                    <Button onClick={() => navigate(`${RHome}/Tests`)} className="w-full">
                        Back to My Tests
                    </Button>
                </Card>
            </div>
        );
    }

    // --- Test Taking View ---
    const currentQuestionMeta = testData.testMetadata?.questionMetadata?.[currentQuestionIndex];
    // Add extra safety check
    if (!currentQuestionMeta) {
        console.error(
            'Error: Could not find current question metadata at index',
            currentQuestionIndex,
            testData
        );
        return <NotFound message="Error loading current question data." />;
    }

    const questionType = getQuestionType(currentQuestionMeta);
    // Ensure answers are arrays before spreading
    const correctAnswers = Array.isArray(currentQuestionMeta.correctAnswers)
        ? currentQuestionMeta.correctAnswers
        : [];
    const incorrectAnswers = Array.isArray(currentQuestionMeta.incorrectAnswers)
        ? currentQuestionMeta.incorrectAnswers
        : [];
    const allAnswers = [...correctAnswers, ...incorrectAnswers];
    // TODO: Shuffle 'allAnswers' if testData.immutableTest.shuffleVariants is true

    const selectedAnswersSet = new Set(userAnswers[currentQuestionMeta.id] || []);
    const progressValue =
        ((currentQuestionIndex + 1) / (testData.testMetadata?.questionMetadata?.length || 1)) * 100;

    const formatTime = seconds => {
        if (seconds === null || seconds < 0) return '--:--'; // Handle null or negative
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
            <header className="sticky top-0 z-40 bg-white dark:bg-slate-800 shadow-md px-4 sm:px-6 py-3 border-b dark:border-slate-700">
                <div className="flex justify-between items-center max-w-5xl mx-auto">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                        <Button
                            variant="outline" // Or "ghost" for a less prominent look
                            size="icon" // Makes it a small square button, good for an icon
                            onClick={handleTopLeftButtonClick}
                            aria-label="Back to tests" // For accessibility
                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <h1
                            className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100 truncate"
                            title={testData.testMetadata?.name}
                        >
                            {testData.testMetadata?.name || 'Test'}
                        </h1>
                    </div>
                    {timeLeft !== null && (
                        <div className="flex items-center space-x-2 text-sm font-medium text-red-600 dark:text-red-400">
                            <Timer className="h-5 w-5" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    )}
                </div>
                <Progress value={progressValue} className="mt-2 h-1.5" />
            </header>

            <main className="flex-1 w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
                <Card className="shadow-lg rounded-lg dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                            Question {currentQuestionIndex + 1} of{' '}
                            {testData.testMetadata?.questionMetadata?.length || 0}
                        </CardDescription>
                        <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-50 leading-relaxed">
                            {/* Use dangerouslySetInnerHTML ONLY if question text is guaranteed to be safe HTML, otherwise render as text */}
                            {currentQuestionMeta.text}
                        </CardTitle>
                        {/* Display Formatted Code if available */}
                        {currentQuestionMeta.formatAndCode?.code && (
                            <div className="mt-3 p-3 bg-slate-100 dark:bg-slate-700/50 rounded text-sm border dark:border-slate-600">
                                <pre className="whitespace-pre-wrap font-mono text-slate-700 dark:text-slate-300">
                                    <code>{currentQuestionMeta.formatAndCode.code}</code>
                                </pre>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent>
                        {/* Answer Options */}
                        {questionType === QuestionType.SINGLE_CHOICE ? (
                            <RadioGroup
                                value={selectedAnswersSet.values().next().value || ''}
                                onValueChange={value =>
                                    handleAnswerChange(currentQuestionMeta.id, value, true)
                                }
                                className="space-y-3"
                            >
                                {allAnswers.map(answer => (
                                    <div
                                        key={answer.id}
                                        className="flex items-center space-x-3 p-3 border dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                    >
                                        <RadioGroupItem
                                            value={answer.id}
                                            id={`q${currentQuestionIndex}-a${answer.id}`}
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
                            // MULTIPLE_CHOICE
                            <div className="space-y-3">
                                {allAnswers.map(answer => (
                                    <div
                                        key={answer.id}
                                        className="flex items-center space-x-3 p-3 border dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
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
                    <CardFooter className="flex justify-between pt-6">
                        <Button
                            variant="outline"
                            onClick={goToPrev}
                            disabled={currentQuestionIndex === 0 || status === 'submitting'}
                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                        >
                            <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                        </Button>

                        {currentQuestionIndex <
                        (testData.testMetadata?.questionMetadata?.length || 0) - 1 ? (
                            <Button
                                onClick={goToNext}
                                disabled={status === 'submitting'}
                                className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                            >
                                Next <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                        ) : (
                            // Use AlertDialog for final submission confirmation
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        disabled={status === 'submitting'}
                                        className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                                    >
                                        {status === 'submitting' ? 'Submitting...' : 'Submit Test'}
                                        <Send className="ml-2 h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="dark:bg-slate-800">
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
                                            onClick={() => handleSubmit(false)} // Pass false for manual submit
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
