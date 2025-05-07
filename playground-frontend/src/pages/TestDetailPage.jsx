import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { RHome, Routes as RRoutes, RQuestions } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import Header from '@/components/Header.jsx';
import {
    CalendarDays,
    CheckSquare,
    ClipboardList,
    Clock,
    FileWarning,
    Link as LinkIcon,
    ListChecks,
    Shuffle,
    User,
    XSquare,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TestDetailPage() {
    // Renamed component
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
                `${Endpoints.ImmutableTest.Base}/id?id=${id}`, // Backend endpoint remains the same
                'GET',
                null,
                auth.accessToken,
                (type, msg) => {
                    setStatus('notfound');
                    toast.error(`Failed to load test details: ${msg || 'Unknown error'}`, {
                        duration: 4000,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                data => {
                    setTest(data);
                    setStatus('loaded');
                    document.title = `${data.name || 'Test Details'} - Playground`; // Updated title
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

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-6xl mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
                    <div className="md:col-span-1 flex flex-col gap-6 xl:gap-8">
                        <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center">
                                    <ClipboardList
                                        size={22}
                                        className="mr-3 text-sky-600 dark:text-sky-500"
                                    />{' '}
                                    {/* Changed Icon */}
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
                                <div className="flex items-center text-slate-700 dark:text-slate-300">
                                    {test.active ? (
                                        <CheckSquare
                                            size={14}
                                            className="mr-2 text-green-600 dark:text-green-400"
                                        />
                                    ) : (
                                        <XSquare
                                            size={14}
                                            className="mr-2 text-red-600 dark:text-red-500"
                                        />
                                    )}
                                    Status: {test.active ? 'Active' : 'Inactive / Expired'}
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
                                            Questions snapshot for this test.
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
                                        <p className="text-sm mt-1">This test seems empty.</p>
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
                                                            View
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
