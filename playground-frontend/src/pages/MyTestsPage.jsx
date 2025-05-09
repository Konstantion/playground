import React, { useCallback, useEffect, useMemo, useState } from 'react'; // Added useMemo
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { RTest, RUserTestResult } from '@/rout/Routes.jsx'; // Added RHome
import Loading from '@/components/Loading.jsx';
import {
    AlertCircle,
    CheckCircle,
    FileText,
    FileWarning,
    Filter as FilterIcon,
    Info,
    Loader2,
    PlayCircle,
    PlusCircle,
    RotateCcw,
    Search,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
import { Label } from '@/components/ui/label';

const UserTestStatus = {
    NOT_STARTED: 'NOT_STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    EXPIRED: 'EXPIRED',
    CANCELLED: 'CANCELLED',
};

const getStatusProps = status => {
    switch (status) {
        case UserTestStatus.NOT_STARTED:
            return { text: 'Ready to Start', icon: PlayCircle, color: 'sky', variant: 'outline' };
        case UserTestStatus.IN_PROGRESS:
            return { text: 'In Progress', icon: RotateCcw, color: 'amber', variant: 'default' };
        case UserTestStatus.COMPLETED:
            return { text: 'Completed', icon: CheckCircle, color: 'green', variant: 'secondary' };
        case UserTestStatus.EXPIRED:
            return { text: 'Expired', icon: AlertCircle, color: 'red', variant: 'destructive' };
        case UserTestStatus.CANCELLED:
            return { text: 'Cancelled', icon: XCircle, color: 'gray', variant: 'outline' };
        default:
            return { text: 'Unknown', icon: Info, color: 'gray', variant: 'outline' };
    }
};

// --- Filter Options ---
const statusFilterOptions = [
    { value: 'ALL', label: 'All Tests' },
    { value: UserTestStatus.NOT_STARTED, label: 'Ready to Start' },
    { value: UserTestStatus.IN_PROGRESS, label: 'In Progress' },
    { value: UserTestStatus.COMPLETED, label: 'Completed' },
    { value: UserTestStatus.EXPIRED, label: 'Expired' },
    { value: UserTestStatus.CANCELLED, label: 'Cancelled' },
];
// --- End Filter Options ---

export default function MyTestsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [allUserTests, setAllUserTests] = useState([]); // Renamed from userTests for clarity
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [addTestId, setAddTestId] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [startingTestId, setStartingTestId] = useState(null);

    // --- State for search and filter ---
    const [searchQuery, setSearchQuery] = useState('');
    const [activeStatusFilter, setActiveStatusFilter] = useState('ALL');
    // --- End State for search and filter ---

    const fetchMyTests = useCallback(async () => {
        setLoading(true);
        await authenticatedReq(
            Endpoints.UserTest.Base,
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
                setAllUserTests(
                    // Changed to setAllUserTests
                    testsData.map(t => ({
                        id: t.id,
                        immutableTestId: t.testId,
                        name: t.testMetadata?.name || 'Unnamed Test',
                        status: t.status,
                        score: t.score,
                    }))
                );
                setLoading(false);
            }
        );
    }, [auth.accessToken, logout]);

    useEffect(() => {
        fetchMyTests();
    }, [fetchMyTests]);

    // --- Filtered Tests Logic ---
    const filteredUserTests = useMemo(() => {
        return allUserTests.filter(test => {
            const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus =
                activeStatusFilter === 'ALL' || test.status === activeStatusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [allUserTests, searchQuery, activeStatusFilter]);
    // --- End Filtered Tests Logic ---

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
            Endpoints.UserTest.Base,
            'POST',
            { immutableTestId: trimmedId },
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
                const newTestEntry = {
                    id: createdUserTest.id,
                    immutableTestId: createdUserTest.testId,
                    name: createdUserTest.testMetadata?.name || 'Unnamed Test',
                    status: createdUserTest.status,
                    score: createdUserTest.score,
                };
                setAllUserTests(prev => [...prev, newTestEntry]); // Add to allUserTests
                toast.success(`Test "${newTestEntry.name}" added successfully!`, {
                    duration: 3000,
                });
                setAddTestId('');
                setIsAddDialogOpen(false);
                setIsAdding(false);
            }
        );
    };

    const handleStartOrContinueTest = async (userTestId, currentStatus) => {
        setStartingTestId(userTestId);

        if (currentStatus === UserTestStatus.NOT_STARTED) {
            await authenticatedReq(
                `${Endpoints.UserTest.Base}/${userTestId}/start`,
                'PUT',
                null,
                auth.accessToken,
                (type, message) => {
                    toast.error(`Failed to start test: ${message || 'Unknown error'}`, {
                        duration: 4000,
                    });
                    if (type === ErrorType.TokenExpired) logout();
                    setStartingTestId(null);
                },
                updatedTestData => {
                    setAllUserTests(
                        (
                            prev // Update allUserTests
                        ) =>
                            prev.map(t =>
                                t.id === userTestId ? { ...t, status: updatedTestData.status } : t
                            )
                    );
                    toast.success(
                        `Starting test "${updatedTestData.testMetadata?.name || userTestId}"...`,
                        { duration: 1500 }
                    );
                    navigate(`${RTest}/${userTestId}`);
                    // No need to setStartingTestId(null) here as navigation occurs
                }
            );
        } else if (currentStatus === UserTestStatus.IN_PROGRESS) {
            toast.info(`Resuming test...`, { duration: 1500 });
            navigate(`${RTest}/${userTestId}`);
            setStartingTestId(null); // Reset after navigation attempt
        } else {
            toast.warning(`Cannot start or continue test with status: ${currentStatus}`, {
                duration: 3000,
            });
            setStartingTestId(null);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6 xl:gap-8 p-4 md:p-6">
            <Card className="col-span-1 shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                <CardHeader className="pb-4 border-b dark:border-slate-700/50">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex items-center">
                            <FileText
                                size={24}
                                className="mr-3 text-sky-600 dark:text-sky-500 flex-shrink-0"
                            />
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    My Tests
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    View your assigned tests or add a new one. (
                                    {filteredUserTests.length} of {allUserTests.length} shown)
                                </CardDescription>
                            </div>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 w-full sm:w-auto"
                                >
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Test by ID
                                </Button>
                            </DialogTrigger>
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
                                        {isAdding ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : null}
                                        {isAdding ? 'Adding...' : 'Add Test'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                    {/* --- START: Search and Filter UI --- */}
                    <div className="mb-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                                type="search"
                                placeholder="Search tests by name..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            <FilterIcon className="h-5 w-5 text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline-block" />
                            <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-2 hidden sm:inline-block">
                                Filter by status:
                            </Label>
                            {statusFilterOptions.map(option => (
                                <Button
                                    key={option.value}
                                    variant={
                                        activeStatusFilter === option.value ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setActiveStatusFilter(option.value)}
                                    className={cn(
                                        'transition-colors text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1.5',
                                        activeStatusFilter === option.value
                                            ? 'bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white'
                                            : 'dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700'
                                    )}
                                >
                                    {option.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    {/* --- END: Search and Filter UI --- */}

                    {loading ? (
                        <Loading message="Loading your tests..." />
                    ) : filteredUserTests.length === 0 ? ( // Use filteredUserTests
                        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                            <FileWarning
                                size={48}
                                className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                            />
                            <p className="font-semibold text-lg">No Tests Found</p>
                            <p className="text-sm mt-1">
                                {searchQuery || activeStatusFilter !== 'ALL'
                                    ? 'Try adjusting your search or filter.'
                                    : "You haven't been assigned any tests yet, or add one using an ID."}
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="h-[calc(100vh-360px)] min-h-[300px]">
                            {' '}
                            {/* Adjusted height */}
                            <ul className="divide-y dark:divide-slate-700/50">
                                {filteredUserTests.map(test => {
                                    // Use filteredUserTests
                                    const statusProps = getStatusProps(test.status);
                                    const isLoadingStart = startingTestId === test.id;
                                    const canStartOrContinue =
                                        test.status === UserTestStatus.NOT_STARTED ||
                                        test.status === UserTestStatus.IN_PROGRESS;
                                    const isCompleted =
                                        test.status === UserTestStatus.COMPLETED ||
                                        test.status === UserTestStatus.EXPIRED;

                                    return (
                                        <li
                                            key={test.id}
                                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors gap-3"
                                        >
                                            <div className="flex flex-col overflow-hidden mr-3 flex-grow">
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
                                            <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                                                <Badge
                                                    variant={statusProps.variant}
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
                                                        disabled={isLoadingStart}
                                                        className="text-xs dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700 w-[90px] justify-center"
                                                    >
                                                        {isLoadingStart ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <PlayCircle
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
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
                                                        className="text-xs text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-700/30 w-[90px] justify-center"
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
