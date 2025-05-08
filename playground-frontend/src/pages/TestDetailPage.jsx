import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { Routes as RRoutes, RQuestions } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import Header from '@/components/Header.jsx';
import { RHome } from '@/rout/Routes.jsx';
import {
    ClipboardList, // Changed icon
    CalendarDays,
    User,
    Clock,
    CheckSquare,
    XSquare,
    Shuffle,
    ListChecks,
    Link as LinkIcon,
    FileWarning,
    Archive, // Added icons
    CheckCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label.js';

// Define Status constants matching backend enum
const ImmutableTestStatus = {
    ACTIVE: 'ACTIVE',
    ARCHIVED: 'ARCHIVED',
};

// Helper to get display properties based on status (can be shared or redefined)
const getStatusProps = status => {
    switch (status) {
        case ImmutableTestStatus.ACTIVE:
            return { text: 'Active', icon: CheckCircle, color: 'green', variant: 'secondary' };
        case ImmutableTestStatus.ARCHIVED:
            return { text: 'Archived', icon: Archive, color: 'gray', variant: 'outline' };
        default:
            return { text: 'Unknown', icon: FileWarning, color: 'yellow', variant: 'outline' };
    }
};

export default function TestDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const [test, setTest] = useState(null);
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        if (!id) {
            setStatus('notfound');
            return;
        }
        const fetchTestData = async () => {
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
                    setTest(data);
                    setStatus('loaded');
                    document.title = `${data.name || 'Test Details'} - Playground`;
                }
            );
        };
        fetchTestData();
    }, [id, auth.accessToken, logout, navigate]);

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

    const statusProps = getStatusProps(test.status); // Get status display props

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
                    {/* Column 1: Test Details & Configuration */}
                    <div className="md:col-span-1 flex flex-col gap-6 xl:gap-8">
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
                                {/* Display Status Badge */}
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
                            </CardContent>
                        </Card>
                    </div>

                    {/* Column 2: Included Questions */}
                    <div className="md:col-span-2">
                        <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col min-h-[400px]">
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
                                    <ScrollArea className="h-[calc(100vh-300px)] md:h-auto md:max-h-[calc(100vh-250px)] xl:max-h-[75vh]">
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
                    </div>
                </div>
            </main>
        </div>
    );
}
