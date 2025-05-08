import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useAuth} from '@/hooks/useAuth.jsx';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {ErrorType} from '@/utils/ErrorType.js';
import {toast} from 'sonner';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import Header from '@/components/Header.jsx';
import {RHome} from '@/rout/Routes.jsx'; // Import necessary routes
import {
    AlertTriangle,
    ArrowLeft,
    Check,
    CheckCircle,
    Clock,
    HelpCircle,
    ListChecks,
    Target,
    X,
    XCircle,
} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Separator} from '@/components/ui/separator';
import {Role} from '@/entities/Role.js'; // For visual separation

// Re-use or redefine status helpers if not globally available
const UserTestStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

const getUserTestStatusProps = status => {
    switch (status) {
        case UserTestStatus.NOT_STARTED:
            return { text: 'Not Started', icon: ListChecks, color: 'blue', variant: 'outline' };
        case UserTestStatus.IN_PROGRESS:
            return { text: 'In Progress', icon: Clock, color: 'yellow', variant: 'outline' };
        case UserTestStatus.COMPLETED:
            return { text: 'Completed', icon: CheckCircle, color: 'green', variant: 'secondary' };
        case UserTestStatus.EXPIRED:
            return { text: 'Expired', icon: AlertTriangle, color: 'red', variant: 'outline' };
        case UserTestStatus.CANCELLED:
            return { text: 'Cancelled', icon: XCircle, color: 'gray', variant: 'outline' };
        default:
            return { text: 'Unknown', icon: HelpCircle, color: 'gray', variant: 'outline' };
    }
};

// --- Component to display individual question results ---
// Renamed from UserTestResultPage to avoid naming conflict
function QuestionResultDisplay({ questionMetadata, userAnswerData, isStudent }) {
    // Ensure userAnswerData and its answers property are defined before mapping
    const studentAnswerIds = new Set(userAnswerData?.answers?.map(a => a.id) || []);
    const correctMetadataAnswerIds = new Set(
        questionMetadata?.correctAnswers?.map(a => a.id) || []
    );

    // Determine if the student's answer for this question is correct
    const isCorrect =
        studentAnswerIds.size === correctMetadataAnswerIds.size &&
        [...studentAnswerIds].every(id => correctMetadataAnswerIds.has(id));

    // Combine all possible answers (correct and incorrect) from the metadata for display
    const allPossibleAnswers = [
        ...(questionMetadata?.correctAnswers || []),
        ...(questionMetadata?.incorrectAnswers || []),
    ].sort((a, b) => (a.id || '').localeCompare(b.id || '')); // Sort consistently for display, handle potential null IDs

    return (
        <Card className="mb-4 dark:bg-slate-800 border dark:border-slate-700/50">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold dark:text-slate-100">
                    {questionMetadata?.text || 'Question text missing'}
                </CardTitle>
                <CardDescription className="text-xs dark:text-slate-400">
                    Question ID: {questionMetadata?.questionId || 'N/A'} | Metadata ID:{' '}
                    {questionMetadata?.id || 'N/A'}
                </CardDescription>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
                <div>
                    <h4 className="font-semibold mb-1 dark:text-slate-300">Possible Answers:</h4>
                    <ul className="list-disc list-inside space-y-1 pl-2">
                        {allPossibleAnswers.map(answer => {
                            const isCorrectAnswer = correctMetadataAnswerIds.has(answer.id);
                            const isStudentSelection = studentAnswerIds.has(answer.id);
                            return (
                                <li
                                    key={answer.id}
                                    className={cn(
                                        'flex items-center',
                                        isStudentSelection ? 'font-bold' : '',
                                        // Highlight correct answers green, incorrect selections red
                                        isCorrectAnswer && !isStudent
                                            ? 'text-green-700 dark:text-green-400'
                                            : 'text-slate-700 dark:text-slate-300',
                                        isStudentSelection &&
                                            !isCorrectAnswer &&
                                            !isStudent &&
                                            'text-red-700 dark:text-red-400' // Style incorrect selections red
                                    )}
                                >
                                    {
                                        isStudentSelection ? (
                                            <Check
                                                size={14}
                                                className="mr-2 text-blue-500 flex-shrink-0"
                                                title="Student's Selection"
                                            />
                                        ) : (
                                            <span className="inline-block w-[14px] mr-2 flex-shrink-0"></span>
                                        ) /* Placeholder for alignment */
                                    }
                                    {answer.answer}
                                    {isCorrectAnswer && !isStudent && (
                                        <Target
                                            size={14}
                                            className="ml-2 text-green-500 flex-shrink-0"
                                            title="Correct Answer"
                                        />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <Separator className="dark:bg-slate-700" />
                <div>
                    <h4 className="font-semibold mb-1 dark:text-slate-300">Student's Answer:</h4>
                    {userAnswerData?.answers?.length > 0 ? (
                        <p className="dark:text-slate-200">
                            {userAnswerData.answers.map(a => `"${a.answer}"`).join(', ')}
                        </p>
                    ) : (
                        <p className="italic text-slate-500 dark:text-slate-400">
                            No answer submitted for this question.
                        </p>
                    )}
                </div>
                <div className="flex items-center pt-2">
                    <span className="font-semibold mr-2 dark:text-slate-300">Result:</span>
                    {isCorrect ? (
                        <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300"
                        >
                            <Check className="mr-1 h-3 w-3" /> Correct
                        </Badge>
                    ) : (
                        <Badge
                            variant="destructive"
                            className="bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300"
                        >
                            <X className="mr-1 h-3 w-3" /> Incorrect
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
// --- END: QuestionResultDisplay Component ---

// --- Main Page Component ---
export default function UserTestResultPage() {
    const { userTestId } = useParams(); // Get userTestId from route params
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const [userTest, setUserTest] = useState(null);
    const [pageStatus, setPageStatus] = useState('loading'); // 'loading', 'loaded', 'notfound', 'error'

    const fetchUserTest = useCallback(async () => {
        if (!userTestId || !auth.accessToken) {
            setPageStatus('error');
            toast.error('Missing User Test ID or authentication.');
            return;
        }
        setPageStatus('loading');
        await authenticatedReq(
            `${Endpoints.UserTest.Base}/${userTestId}`, // Use the GET endpoint for specific user test
            'GET',
            null,
            auth.accessToken,
            (type, msg) => {
                setPageStatus(type === ErrorType.Forbidden ? 'error' : 'notfound');
                toast.error(`Failed to load test results: ${msg || 'Unknown error'}`, {
                    duration: 4000,
                });
                if (type === ErrorType.TokenExpired) logout();
            },
            data => {
                const details = {
                    ...data,
                    testMetadata: data.testMetadata || {},
                    questionMetadata: Array.isArray(data.testMetadata?.questionMetadata)
                        ? data.testMetadata.questionMetadata
                        : [],
                    questionAnswers: Array.isArray(data.questionAnswers)
                        ? data.questionAnswers
                        : [],
                    user: data.user || {},
                };
                // Pre-process map for easier lookup
                details.studentAnswersMap = new Map(
                    details.questionAnswers.map(qa => [qa.questionId, qa])
                );

                setUserTest(details);
                setPageStatus('loaded');
                document.title = `Results: ${details.testMetadata?.name || 'Test'} - ${details.user?.username || 'Student'}`;
            }
        );
    }, [userTestId, auth.accessToken, logout]);

    useEffect(() => {
        fetchUserTest();
    }, [fetchUserTest]);

    // --- Render states ---
    if (pageStatus === 'loading') {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <Loading message="Loading test results..." />
            </div>
        );
    }

    if (pageStatus === 'notfound') {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <NotFound message="Test attempt not found." />
            </div>
        );
    }

    if (pageStatus === 'error' || !userTest) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <div className="container mx-auto p-4 md:p-6 lg:p-8 text-center">
                    <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                    <p className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400">
                        Access Denied or Error
                    </p>
                    <p className="mt-2 text-sm text-red-600 dark:text-red-300">
                        Could not load test results. You may not have permission, or an error
                        occurred.
                    </p>
                    <Button onClick={() => navigate(-1)} variant="outline" className="mt-4">
                        {' '}
                        {/* Go back */}
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const statusProps = getUserTestStatusProps(userTest.status);
    const immutableTestId = userTest.testId; // Get the parent immutable test ID

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-5xl mx-auto w-full">
                {/* Back Button to the Immutable Test Detail Page */}
                <Button
                    onClick={() => navigate(-1)}
                    variant="outline"
                    size="sm"
                    className="mb-4 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 dark:border-slate-600"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {/* Summary Card */}
                <Card className="mb-6 shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div>
                                <CardTitle className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100">
                                    Test Results: {userTest.testMetadata?.name || 'Unnamed Test'}
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Attempt by: {userTest.user?.username || 'Unknown User'} (ID:{' '}
                                    {userTest.user?.id || 'N/A'})
                                </CardDescription>
                            </div>
                            <Badge
                                variant={statusProps.variant}
                                className={cn(
                                    'text-sm py-1 px-3 self-start sm:self-center',
                                    `bg-${statusProps.color}-100 text-${statusProps.color}-700 dark:bg-${statusProps.color}-700/30 dark:text-${statusProps.color}-300 border-${statusProps.color}-300 dark:border-${statusProps.color}-700`
                                )}
                            >
                                <statusProps.icon size={14} className="mr-1.5" />
                                {statusProps.text}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2">
                        <div className="flex items-center text-slate-700 dark:text-slate-300">
                            <CheckCircle
                                size={14}
                                className="mr-2 text-slate-500 dark:text-slate-400"
                            />
                            <strong>Score:</strong>&nbsp;
                            {userTest.score !== null ? (
                                <span
                                    className={cn(
                                        'font-semibold',
                                        userTest.score >= 60
                                            ? 'text-green-600 dark:text-green-400'
                                            : 'text-red-600 dark:text-red-400'
                                    )}
                                >
                                    {userTest.score.toFixed(2)}%
                                </span>
                            ) : (
                                <span className="italic text-slate-500 dark:text-slate-400">
                                    Not scored
                                </span>
                            )}
                        </div>
                        {userTest.startedAt && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <Clock
                                    size={14}
                                    className="mr-2 text-slate-500 dark:text-slate-400"
                                />
                                <strong>Started:</strong>&nbsp;
                                {new Date(userTest.startedAt).toLocaleString()}
                            </div>
                        )}
                        {userTest.completedAt && (
                            <div className="flex items-center text-slate-700 dark:text-slate-300">
                                <CheckCircle
                                    size={14}
                                    className="mr-2 text-slate-500 dark:text-slate-400"
                                />
                                <strong>Finished:</strong>&nbsp;
                                {new Date(userTest.completedAt).toLocaleString()}
                            </div>
                        )}
                        <p className="text-xs text-slate-500 dark:text-slate-400 pt-1">
                            User Test ID: {userTest.id} | Source Test ID: {userTest.testId}
                        </p>
                    </CardContent>
                </Card>

                {/* Questions Breakdown */}
                <h2 className="text-xl font-semibold mb-4 dark:text-slate-200">
                    Question Breakdown
                </h2>
                {userTest.testMetadata?.questionMetadata?.length > 0 ? (
                    userTest.testMetadata.questionMetadata.map(qMeta => (
                        // *** CORRECTED: Use QuestionResultDisplay here ***
                        <QuestionResultDisplay
                            key={qMeta.id || qMeta.questionId} // Use unique key
                            questionMetadata={qMeta}
                            userAnswerData={userTest.studentAnswersMap.get(qMeta.id)} // Use questionId for lookup if map uses it
                            isStudent={auth.user.role === Role.Student}
                        />
                    ))
                ) : (
                    <p className="text-slate-500 dark:text-slate-400 italic">
                        No question details available for this test attempt.
                    </p>
                )}
            </main>
        </div>
    );
}
