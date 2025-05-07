import React, { useEffect, useState } from 'react';
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
import { Routes as RRoutes } from '@/rout/Routes.jsx'; // Assuming RTest is for taking a test
import Loading from '@/components/Loading.jsx';
import { CheckCircle, FileText, FileWarning, PlayCircle, PlusCircle } from 'lucide-react'; // Added icons
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

export default function MyTestsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [userTests, setUserTests] = useState([]); // Renamed state
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [addTestId, setAddTestId] = useState('');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Fetch student's tests
    useEffect(() => {
        const fetchMyTests = async () => {
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
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                data => {
                    const testsData = Array.isArray(data) ? data : [];
                    // Map the UserTestResponse structure
                    setUserTests(
                        testsData.map(t => ({
                            id: t.id, // This is the UserTest ID
                            immutableTestId: t.testId, // ID of the source ImmutableTest
                            name: t.testMetadata?.name || 'Unnamed Test', // Get name from metadata
                            active: t.active, // Is the test attempt active/pending?
                            // Add more fields from UserTestResponse/TestMetadataResponse as needed
                            // e.g., createdAt: t.testMetadata?.createdAt
                        }))
                    );
                    setLoading(false);
                }
            );
        };
        fetchMyTests();
    }, [auth.accessToken, logout, navigate]);

    // Handler for adding a new test by ID
    const handleAddTest = async () => {
        const trimmedId = addTestId.trim();
        if (!trimmedId) {
            toast.error('Please enter a Test ID.', { duration: 3000 });
            return;
        }
        // Basic UUID validation (optional but recommended)
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
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
                setIsAdding(false);
            },
            createdUserTest => {
                // Map the response to the format used in the state
                const newTestEntry = {
                    id: createdUserTest.id,
                    immutableTestId: createdUserTest.testId,
                    name: createdUserTest.testMetadata?.name || 'Unnamed Test',
                    active: createdUserTest.active,
                };
                setUserTests(prev => [...prev, newTestEntry]);
                toast.success(`Test "${newTestEntry.name}" added successfully!`, {
                    duration: 3000,
                });
                setAddTestId(''); // Clear input
                setIsAddDialogOpen(false); // Close dialog
                setIsAdding(false);
            }
        );
    };

    // Handler to navigate to the test taking page (implementation needed later)
    const handleStartTest = userTestId => {
        // TODO: Implement navigation to the actual test-taking interface
        // This might involve fetching the full UserTest details including questions/answers
        // For now, just log or show a toast
        toast.info(`Starting test with UserTest ID: ${userTestId}. (Implementation Pending)`);
        // navigate(`${RTest}/${userTestId}`); // Example navigation
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
                                {userTests.map(test => (
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
                                                Test Attempt ID: {test.id}
                                            </span>
                                            {/* Optionally display source ImmutableTest ID */}
                                            {/* <span className="text-xs text-slate-500 dark:text-slate-400">
                                                Source ID: {test.immutableTestId}
                                            </span> */}
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <Badge
                                                variant={test.active ? 'default' : 'secondary'}
                                                className={cn(
                                                    'text-xs py-0.5 px-1.5',
                                                    test.active
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                                                )}
                                            >
                                                {test.active ? (
                                                    <PlayCircle size={12} className="mr-1" />
                                                ) : (
                                                    <CheckCircle size={12} className="mr-1" />
                                                )}
                                                {test.active ? 'Ready / In Progress' : 'Completed'}
                                            </Badge>
                                            {test.active && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => handleStartTest(test.id)}
                                                    className="text-xs dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                                                >
                                                    {/* Check if test is already in progress later */}
                                                    Start / Continue
                                                </Button>
                                            )}
                                            {!test.active && (
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-xs text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-700/30"
                                                    // onClick={() => navigate(`/results/${test.id}`)} // Example navigation to results
                                                    onClick={() =>
                                                        toast.info(
                                                            `Viewing results for ${test.id} (Pending)`
                                                        )
                                                    }
                                                >
                                                    View Results
                                                </Button>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </ScrollArea>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
