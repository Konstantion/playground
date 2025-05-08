// playground-frontend/src/pages/MyTestsPage.jsx

import React, {useCallback, useEffect, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle,} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {useAuth} from '@/hooks/useAuth.jsx';
import {ErrorType} from '@/utils/ErrorType.js';
import {toast} from 'sonner';
import {useNavigate} from 'react-router-dom';
import {RTest, RUserTestResult} from '@/rout/Routes.jsx'; // Import RTest and RHome
import Loading from '@/components/Loading.jsx';
import {
    AlertCircle,
    CheckCircle,
    FileText,
    FileWarning,
    Info,
    Loader2,
    PlayCircle,
    PlusCircle,
    RotateCcw,
    XCircle,
} from 'lucide-react'; // Added/updated icons
import {Badge} from '@/components/ui/badge';
import {cn} from '@/lib/utils';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import {Label} from '@/components/ui/label';

// Define Status constants matching backend enum
const UserTestStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

// Helper to get display properties based on status
const getStatusProps = status => {
    switch (status) {
        case UserTestStatus.NOT_STARTED:
            // Using blue-ish color for not started
            return { text: 'Ready to Start', icon: PlayCircle, color: 'sky', variant: 'outline' };
        case UserTestStatus.IN_PROGRESS:
            // Using amber/orange for in progress
            return { text: 'In Progress', icon: RotateCcw, color: 'amber', variant: 'default' };
        case UserTestStatus.COMPLETED:
            return { text: 'Completed', icon: CheckCircle, color: 'green', variant: 'secondary' };
        case UserTestStatus.EXPIRED:
            return { text: 'Expired', icon: AlertCircle, color: 'red', variant: 'destructive' };
        case UserTestStatus.CANCELLED:
            return { text: 'Cancelled', icon: XCircle, color: 'gray', variant: 'outline' }; // Assuming XCircle exists
        default:
            return { text: 'Unknown', icon: Info, color: 'gray', variant: 'outline' };
    }
};

export default function MyTestsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [userTests, setUserTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [addTestId, setAddTestId] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [startingTestId, setStartingTestId] = useState(null); // Track which test is being started

    // Fetch student's tests
    const fetchMyTests = useCallback(async () => {
        // Wrap in useCallback
        setLoading(true);
        await authenticatedReq(
            Endpoints.UserTest.Base, // Use the correct endpoint base
            'GET',
            null,
            auth.accessToken,
            (type, message) => {
                setLoading(false);
                toast.error(message || 'Failed to load your tests.', {
                    closeButton: true,
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) logout();
            },
            data => {
                const testsData = Array.isArray(data) ? data : [];
                // Map the UserTestResponse structure, using the new status field
                setUserTests(
                    testsData.map(t => ({
                        id: t.id, // This is the UserTest ID
                        immutableTestId: t.testId, // ID of the source ImmutableTest
                        name: t.testMetadata?.name || 'Unnamed Test', // Get name from metadata
                        status: t.status, // Use the new status field
                        score: t.score, // Include score
                        // Add other fields like startedAt, completedAt if needed for display
                    }))
                );
                setLoading(false);
            }
        );
    }, [auth.accessToken, logout]); // Dependencies for useCallback

    useEffect(() => {
        fetchMyTests();
    }, [fetchMyTests]); // Run fetchMyTests on mount

    // Handler for adding a new test by ID
    const handleAddTest = async () => {
        const trimmedId = addTestId.trim();
        if (!trimmedId) {
            toast.error('Please enter a Test ID.', { duration: 3000 });
            return;
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedId)) {
            toast.error('Invalid Test ID format. Please check the ID.', { duration: 4000 });
            return;
        }

        setIsAdding(true);
        await authenticatedReq(
            Endpoints.UserTest.Base, // POST to the base endpoint
            'POST',
            { immutableTestId: trimmedId }, // Send the ID in the request body
            auth.accessToken,
            (type, message) => {
                toast.error(
                    message ||
                        'Failed to add test. It might be invalid, expired, or already added.',
                    {
                        closeButton: true,
                        duration: 5000,
                    }
                );
                if (type === ErrorType.TokenExpired) logout();
                setIsAdding(false);
            },
            createdUserTest => {
                // Map the response to the format used in the state
                const newTestEntry = {
                    id: createdUserTest.id,
                    immutableTestId: createdUserTest.testId,
                    name: createdUserTest.testMetadata?.name || 'Unnamed Test',
                    status: createdUserTest.status, // Use status from response
                    score: createdUserTest.score,
                };
                setUserTests(prev => [...prev, newTestEntry]);
                toast.success(`Test "${newTestEntry.name}" added successfully!`, {
                    duration: 3000,
                });
                setAddTestId('');
                setIsAddDialogOpen(false);
                setIsAdding(false);
            }
        );
    };

    // Handler to start or continue a test
    const handleStartOrContinueTest = async (userTestId, currentStatus) => {
        setStartingTestId(userTestId); // Show loading on the button

        // If the test is NOT_STARTED, call the start endpoint first
        if (currentStatus === UserTestStatus.NOT_STARTED) {
            await authenticatedReq(
                `${Endpoints.UserTest.Base}/${userTestId}/start`, // Use the start endpoint
                'PUT', // Use PUT method
                null,
                auth.accessToken,
                (type, message) => {
                    toast.error(`Failed to start test: ${message || 'Unknown error'}`, {
                        duration: 4000,
                    });
                    if (type === ErrorType.TokenExpired) logout();
                    setStartingTestId(null); // Reset loading state on error
                },
                updatedTestData => {
                    // Update the local state for this test
                    setUserTests(prev =>
                        prev.map(t =>
                            t.id === userTestId ? { ...t, status: updatedTestData.status } : t
                        )
                    );
                    toast.success(
                        `Starting test "${updatedTestData.testMetadata?.name || userTestId}"...`,
                        { duration: 1500 }
                    );
                    // Navigate after successful start
                    navigate(`${RTest}/${userTestId}`); // Navigate to the TestTakingPage
                    // No need to reset startingTestId here as we navigate away
                }
            );
        } else if (currentStatus === UserTestStatus.IN_PROGRESS) {
            // If already in progress, just navigate
            toast.info(`Resuming test...`, { duration: 1500 });
            navigate(`${RTest}/${userTestId}`); // Navigate to the TestTakingPage
            setStartingTestId(null); // Reset loading state immediately for resume
        } else {
            // Should not happen if button is disabled correctly, but handle anyway
            toast.warning(`Cannot start or continue test with status: ${currentStatus}`, {
                duration: 3000,
            });
            setStartingTestId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:gap-8">
            <Card className="col-span-1 shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                <CardHeader className="pb-4 border-b dark:border-slate-700/50">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FileText size={24} className="mr-3 text-sky-600 dark:text-sky-500" />
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    My Tests
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    View your assigned tests or add a new one using an ID. (
                                    {userTests.length} total)
                                </CardDescription>
                            </div>
                        </div>
                        {/* Add Test Button Trigger */}
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Test by ID
                                </Button>
                            </DialogTrigger>
                            {/* Add Test Dialog Content */}
                            <DialogContent className="dark:bg-slate-800">
                                <DialogHeader>
                                    <DialogTitle className="dark:text-slate-100">
                                        Add New Test
                                    </DialogTitle>
                                    <DialogDescription className="dark:text-slate-400 pt-1">
                                        Enter the Test ID provided by your teacher.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="my-4 space-y-1.5">
                                    <Label
                                        htmlFor="test-id-input"
                                        className="text-slate-700 dark:text-slate-300"
                                    >
                                        Test ID (UUID)
                                    </Label>
                                    <Input
                                        id="test-id-input"
                                        value={addTestId}
                                        onChange={e => setAddTestId(e.target.value)}
                                        placeholder="Paste Test ID here..."
                                        className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                            disabled={isAdding}
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={handleAddTest}
                                        className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                                        disabled={isAdding}
                                    >
                                        {isAdding ? 'Adding...' : 'Add Test'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <Loading message="Loading your tests..." />
                    ) : userTests.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                            <FileWarning
                                size={48}
                                className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                            />
                            <p className="font-semibold text-lg">No Tests Found</p>
                            <p className="text-sm mt-1">
                                You haven't been assigned any tests yet, or add one using an ID.
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-260px)] min-h-[400px]">
                            <ul className="divide-y dark:divide-slate-700/50">
                                {userTests.map(test => {
                                    const statusProps = getStatusProps(test.status);
                                    const isLoadingStart = startingTestId === test.id;
                                    // Determine if the button should be enabled based on status
                                    const canStartOrContinue =
                                        test.status === UserTestStatus.NOT_STARTED ||
                                        test.status === UserTestStatus.IN_PROGRESS;
                                    const isCompleted =
                                        test.status === UserTestStatus.COMPLETED ||
                                        test.status === UserTestStatus.EXPIRED;

                                    return (
                                        <li
                                            key={test.id}
                                            className="flex justify-between items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                                        >
                                            <div className="flex flex-col overflow-hidden mr-3">
                                                <span
                                                    className="text-md font-medium text-slate-800 dark:text-slate-100 truncate"
                                                    title={test.name}
                                                >
                                                    {test.name}
                                                </span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                                    Attempt ID: {test.id}
                                                </span>
                                                {isCompleted && test.score !== null && (
                                                    <span className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
                                                        Score: {test.score.toFixed(1)}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center space-x-2 flex-shrink-0">
                                                <Badge
                                                    variant={statusProps.variant}
                                                    // Apply dynamic background/text/border colors based on status
                                                    className={cn(
                                                        'text-xs py-0.5 px-1.5',
                                                        `bg-${statusProps.color}-100 text-${statusProps.color}-700 border-${statusProps.color}-300`,
                                                        `dark:bg-${statusProps.color}-900/30 dark:text-${statusProps.color}-300 dark:border-${statusProps.color}-700/50`
                                                    )}
                                                >
                                                    <statusProps.icon size={12} className="mr-1" />
                                                    {statusProps.text}
                                                </Badge>
                                                {canStartOrContinue && (
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            handleStartOrContinueTest(
                                                                test.id,
                                                                test.status
                                                            )
                                                        }
                                                        disabled={isLoadingStart} // Disable only if this specific test is being started
                                                        className="text-xs dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 w-[90px] justify-center" // Fixed width
                                                    >
                                                        {isLoadingStart ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <PlayCircle
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                                {/* Change button text based on status */}
                                                                {test.status ===
                                                                UserTestStatus.NOT_STARTED
                                                                    ? 'Start'
                                                                    : 'Continue'}
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                {isCompleted && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-xs text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-700/30 w-[90px] justify-center" // Fixed width
                                                        onClick={() =>
                                                            navigate(
                                                                `${RUserTestResult}/${test.id}`
                                                            )
                                                        }
                                                    >
                                                        View Results
                                                    </Button>
                                                )}
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
