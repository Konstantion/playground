import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { RHome, RQuestions, RTests, RUserTestResult } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import Header from '@/components/Header.jsx';
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
import {
    AlertTriangle,
    Archive,
    ArrowLeft,
    CalendarDays,
    CheckCircle,
    CheckSquare,
    ClipboardList,
    Clock,
    Eye,
    FileWarning,
    HelpCircle,
    Link as LinkIcon,
    ListChecks,
    Loader2,
    Shuffle,
    User,
    Users,
    XCircle,
    XSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label.js';
import { Role } from '@/entities/Role.js';

const ImmutableTestStatus = {
    ACTIVE: 'ACTIVE',
    ARCHIVED: 'ARCHIVED',
};

const UserTestStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

const getImmutableStatusProps = status => {
    switch (status) {
        case ImmutableTestStatus.ACTIVE:
            return { text: 'Active', icon: CheckCircle, color: 'green', variant: 'secondary' };
        case ImmutableTestStatus.ARCHIVED:
            return { text: 'Archived', icon: Archive, color: 'gray', variant: 'outline' };
        default:
            return { text: 'Unknown', icon: FileWarning, color: 'yellow', variant: 'outline' };
    }
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

function UserAttemptsList({ userTests = [], navigate }) {
    const handleViewAttempt = userTestId => {
        if (navigate && RUserTestResult && userTestId) {
            navigate(`${RUserTestResult}/${userTestId}`);
        } else if (!navigate) {
            toast.error('Navigation function is not available.');
            console.error('Navigation function (navigate prop) is missing in UserAttemptsList.');
        } else if (!RUserTests) {
            toast.error('User Test Result route (RUserTests) is not defined.');
            console.error('RUserTests route constant is not defined or imported correctly.');
        } else if (!userTestId) {
            toast.error('Cannot navigate without a User Test ID.');
            console.error('handleViewAttempt called without a valid userTestId.');
        }
    };
    if (userTests.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-10">
                <Users size={48} className="mx-auto mb-4 text-slate-400 dark:text-slate-500" />
                <p className="font-semibold text-lg">No Student Attempts</p>
                <p className="text-sm mt-1">No students have attempted this test yet.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[200px] md:h-auto md:max-h-[calc(100vh-250px)] xl:max-h-[75vh]">
            <ul className="divide-y dark:divide-slate-700/50">
                {userTests.map(ut => {
                    const userStatusProps = getUserTestStatusProps(ut.status);
                    return (
                        <li
                            key={ut.id}
                            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                <div className="flex-grow overflow-hidden">
                                    <div className="flex items-center mb-1">
                                        <User
                                            size={14}
                                            className="mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0"
                                        />
                                        <span
                                            className="font-medium dark:text-slate-200 truncate"
                                            title={ut.user?.username || 'N/A'}
                                        >
                                            {ut.user?.username || 'N/A'}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                                            (ID: {ut.user?.id || 'N/A'})
                                        </span>
                                    </div>
                                    <div className="flex items-center mb-1">
                                        <Badge
                                            variant={userStatusProps.variant}
                                            className={cn(
                                                'text-xs py-0.5 px-2 whitespace-nowrap',
                                                `bg-${userStatusProps.color}-100 text-${userStatusProps.color}-700 dark:bg-${userStatusProps.color}-700/30 dark:text-${userStatusProps.color}-300 border-${userStatusProps.color}-300 dark:border-${userStatusProps.color}-700`
                                            )}
                                        >
                                            <userStatusProps.icon size={12} className="mr-1" />
                                            {userStatusProps.text}
                                        </Badge>
                                        {ut.score !== null && (
                                            <span
                                                className={cn(
                                                    'ml-3 font-semibold text-sm',
                                                    ut.score >= 60
                                                        ? 'text-green-600 dark:text-green-400'
                                                        : 'text-red-600 dark:text-red-400'
                                                )}
                                            >
                                                Score: {ut.score.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Attempt ID: {ut.id}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewAttempt(ut.id)}
                                    className="text-xs dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 w-full sm:w-auto mt-2 sm:mt-0"
                                >
                                    <Eye size={12} className="mr-1" /> View Attempt
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </ScrollArea>
    );
}

export default function TestDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const [test, setTest] = useState(null);
    const [status, setStatus] = useState('loading');
    const [isArchiving, setIsArchiving] = useState(false);

    const fetchTestData = useCallback(async () => {
        if (!id) {
            setStatus('notfound');
            return;
        }
        setStatus('loading');
        await authenticatedReq(
            `${Endpoints.ImmutableTest.Base}/${id}`,
            'GET',
            null,
            auth.accessToken,
            (type, msg) => {
                setStatus('notfound');
                toast.error(`Failed to load test details: ${msg || 'Unknown error'}`, {
                    duration: 4000,
                });
                if (type === ErrorType.TokenExpired) logout();
            },
            data => {
                const details = {
                    ...data,
                    questions: Array.isArray(data.questions) ? data.questions : [],
                    userTests: Array.isArray(data.userTests) ? data.userTests : [],
                };
                setTest(details);
                setStatus('loaded');
                document.title = `${details.name || 'Test Details'} - Playground`;
            }
        );
    }, [id, auth.accessToken, logout]);

    useEffect(() => {
        fetchTestData();
    }, [fetchTestData]);

    const handleArchive = useCallback(async () => {
        if (!test || isArchiving || test.status !== ImmutableTestStatus.ACTIVE) {
            return;
        }
        setIsArchiving(true);
        await authenticatedReq(
            `${Endpoints.ImmutableTest.Base}/${id}/archive`,
            'PATCH',
            null,
            auth.accessToken,
            (type, message) => {
                toast.error(`Failed to archive test: ${message}`, { closeButton: true });
                if (type === ErrorType.TokenExpired) logout();
                setIsArchiving(false);
            },
            updatedTestData => {
                toast.success(
                    'Test archived successfully. Active student attempts have been cancelled.',
                    { closeButton: true }
                );

                const updatedDetails = {
                    ...updatedTestData,
                    questions: Array.isArray(updatedTestData.questions)
                        ? updatedTestData.questions
                        : [],
                    userTests: Array.isArray(updatedTestData.userTests)
                        ? updatedTestData.userTests
                        : [],
                };
                setTest(updatedDetails);
                setIsArchiving(false);
            }
        );
    }, [test, isArchiving, id, auth.accessToken, logout]);

    const canArchive = useMemo(() => {
        if (!auth.user || !test || test.status !== ImmutableTestStatus.ACTIVE) {
            return false;
        }
        const isCreator = test.creator?.id === auth.user.id;
        const isAdmin = auth.user.role === Role.Admin;
        return isCreator || isAdmin;
    }, [auth.user, test]);

    if (status === 'loading')
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <Loading message="Loading test details..." />
            </div>
        );
    if (status === 'notfound' || !test)
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <NotFound message="Test not found." />
            </div>
        );

    const BooleanDisplay = ({ value, IconTrue = CheckSquare, IconFalse = XSquare, label }) => (
        <div className="flex items-center space-x-2">
            {value ? (
                <IconTrue className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
                <IconFalse className="h-4 w-4 text-red-600 dark:text-red-500" />
            )}
            <span className="text-slate-700 dark:text-slate-300">{label}</span>
        </div>
    );

    const statusProps = getImmutableStatusProps(test.status);

    const archiveButtonAndDialog = (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={
                        isArchiving || !canArchive || test.status === ImmutableTestStatus.ARCHIVED
                    }
                    aria-label="Archive Test"
                >
                    {isArchiving ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Archive className="mr-2 h-4 w-4" />
                    )}
                    {test.status === ImmutableTestStatus.ARCHIVED ? 'Archived' : 'Archive Test'}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-slate-800 dark:border-slate-700">
                <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-slate-100">
                        Confirm Archival
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-slate-400">
                        <div className="flex items-start p-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 rounded-md my-4">
                            <AlertTriangle className="h-6 w-6 text-yellow-500 dark:text-yellow-400 mr-3 flex-shrink-0" />
                            <div>
                                This action cannot be undone. Archiving this test will set its
                                status to 'Archived' and prevent new attempts.
                                <br />
                                <strong className="font-semibold">
                                    Any student attempts currently 'In Progress' will be
                                    automatically cancelled.
                                </strong>{' '}
                                Tests not started will remain but cannot be initiated.
                            </div>
                        </div>
                        Are you sure you want to archive the test "{test.name}"?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 dark:border-slate-600">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleArchive}
                        disabled={isArchiving}
                        className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 dark:text-slate-50"
                    >
                        {isArchiving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Yes, Archive Test
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
                {' '}
                <Button
                    onClick={() => navigate(`${RHome}/${RTests}`)}
                    variant="outline"
                    size="sm"
                    className="mb-4 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 dark:border-slate-600"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests List
                </Button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8">
                    {' '}
                    <div className="lg:col-span-1 flex flex-col gap-6 xl:gap-8">
                        <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center">
                                    <ClipboardList
                                        size={22}
                                        className="mr-3 text-sky-600 dark:text-sky-500"
                                    />
                                    <div>
                                        <CardTitle
                                            className="text-xl font-semibold text-slate-800 dark:text-slate-100 truncate"
                                            title={test.name}
                                        >
                                            {test.name}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                            ID: {test.id}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex items-center text-slate-700 dark:text-slate-300">
                                    <CalendarDays
                                        size={14}
                                        className="mr-2 text-slate-500 dark:text-slate-400"
                                    />
                                    Created: {new Date(test.createdAt).toLocaleString()}
                                </div>
                                {test.creator && (
                                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                                        <User
                                            size={14}
                                            className="mr-2 text-slate-500 dark:text-slate-400"
                                        />
                                        Creator: {test.creator.username} ({test.creator.role})
                                    </div>
                                )}
                                <div className="flex items-center">
                                    <Label className="text-slate-500 dark:text-slate-400 mr-2">
                                        Status:
                                    </Label>
                                    <Badge
                                        variant={statusProps.variant}
                                        className={cn(
                                            'text-xs py-0.5 px-1.5',
                                            `bg-${statusProps.color}-100 text-${statusProps.color}-700 dark:bg-${statusProps.color}-700/30 dark:text-${statusProps.color}-300 border-${statusProps.color}-300 dark:border-${statusProps.color}-700`
                                        )}
                                    >
                                        <statusProps.icon size={12} className="mr-1" />
                                        {statusProps.text}
                                    </Badge>
                                </div>
                                {test.expiresAfter && (
                                    <div className="flex items-center text-slate-700 dark:text-slate-300">
                                        <Clock
                                            size={14}
                                            className="mr-2 text-slate-500 dark:text-slate-400"
                                        />
                                        Expires: {new Date(test.expiresAfter).toLocaleString()}
                                    </div>
                                )}
                                <div className="pt-2 space-y-2">
                                    <BooleanDisplay
                                        value={test.shuffleQuestions}
                                        IconTrue={Shuffle}
                                        IconFalse={Shuffle}
                                        label="Shuffle Questions"
                                    />
                                    <BooleanDisplay
                                        value={test.shuffleVariants}
                                        IconTrue={Shuffle}
                                        IconFalse={Shuffle}
                                        label="Shuffle Variants"
                                    />
                                </div>

                                <div className="pt-4 border-t dark:border-slate-700/50">
                                    <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                                        Actions
                                    </Label>
                                    {canArchive && test.status === ImmutableTestStatus.ACTIVE ? (
                                        archiveButtonAndDialog
                                    ) : test.status === ImmutableTestStatus.ARCHIVED ? (
                                        <p className="text-xs text-gray-500 dark:text-slate-400 italic flex items-center">
                                            <Archive className="mr-1.5 h-3 w-3" /> This test is
                                            archived.
                                        </p>
                                    ) : !canArchive &&
                                      test.status === ImmutableTestStatus.ACTIVE ? (
                                        <p className="text-xs text-gray-500 dark:text-slate-400 italic">
                                            You do not have permission to archive this test.
                                        </p>
                                    ) : null}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-6 xl:gap-8">
                        <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col">
                            <CardHeader className="pb-4 border-b dark:border-slate-700/50">
                                <div className="flex items-center">
                                    <ListChecks
                                        size={20}
                                        className="mr-3 text-sky-600 dark:text-sky-500"
                                    />
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                            Included Questions ({test.questions?.length || 0})
                                        </CardTitle>
                                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                            Questions snapshot for this generated test.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                {test.questions?.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-10">
                                        <FileWarning
                                            size={48}
                                            className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                                        />
                                        <p className="font-semibold text-lg">
                                            No Questions Included
                                        </p>
                                        <p className="text-sm mt-1">
                                            This test instance seems empty.
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[250px]">
                                        {' '}
                                        <ul className="divide-y dark:divide-slate-700/50">
                                            {test.questions.map(q => (
                                                <li
                                                    key={q.id}
                                                    className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <div className="overflow-hidden mr-3">
                                                            <p
                                                                className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate"
                                                                title={q.body}
                                                            >
                                                                {q.body}
                                                            </p>
                                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                                ID: {q.id} | Lang: {q.lang}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                navigate(`${RQuestions}/${q.id}`)
                                                            }
                                                            className="text-xs dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                                        >
                                                            <LinkIcon size={12} className="mr-1" />{' '}
                                                            View Original
                                                        </Button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col">
                            <CardHeader className="pb-4 border-b dark:border-slate-700/50">
                                <div className="flex items-center">
                                    <Users
                                        size={20}
                                        className="mr-3 text-sky-600 dark:text-sky-500"
                                    />
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                            Student Attempts ({test.userTests?.length || 0})
                                        </CardTitle>
                                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                            Attempts based on this test configuration.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                <UserAttemptsList userTests={test.userTests} navigate={navigate} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
