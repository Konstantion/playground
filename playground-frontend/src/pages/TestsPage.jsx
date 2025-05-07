import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Routes as RRoutes, RTests } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import {
    CalendarDays,
    CheckSquare,
    ClipboardList,
    Clock,
    FileWarning,
    Search,
    XSquare,
} from 'lucide-react'; // Changed Icon

export default function TestsPage() {
    // Renamed component
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [tests, setTests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            setLoading(true);
            await authenticatedReq(
                Endpoints.ImmutableTest.Base,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setLoading(false);
                    toast.error(message || 'Failed to load tests.', {
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
                    setTests(
                        testsData.map(t => ({
                            id: t.id,
                            name: t.name,
                            active: t.active,
                            createdAt: t.createdAt,
                            expiresAfter: t.expiresAfter,
                        }))
                    );
                    setLoading(false);
                }
            );
        };
        fetchTests();
    }, [auth.accessToken, logout, navigate]);

    const filteredTests = useMemo(
        () => tests.filter(t => t.name.toLowerCase().includes(search.toLowerCase())),
        [tests, search]
    );

    return (
        <div className="grid grid-cols-1 gap-6 xl:gap-8">
            <div className="col-span-1">
                <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center">
                            <ClipboardList
                                size={24}
                                className="mr-3 text-sky-600 dark:text-sky-500"
                            />{' '}
                            {/* Changed Icon */}
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    Tests {/* Updated Title */}
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    Browse previously generated tests. ({filteredTests.length}{' '}
                                    found) {/* Updated Desc */}
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                                type="search"
                                placeholder="Search tests by name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        {loading ? (
                            <Loading message="Loading tests..." /> // Updated message
                        ) : filteredTests.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <FileWarning
                                    size={48}
                                    className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                                />
                                <p className="font-semibold text-lg">No Tests Found</p>{' '}
                                {/* Updated Text */}
                                <p className="text-sm mt-1">
                                    {search
                                        ? 'Try adjusting your search term.'
                                        : 'Generate tests from the Test Models page.'}
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[calc(100vh-310px)] min-h-[400px] pr-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredTests.map(item => (
                                        <Card
                                            key={item.id}
                                            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:bg-slate-850 dark:hover:bg-slate-700/70 border dark:border-slate-700 rounded-lg overflow-hidden flex flex-col"
                                            onClick={() => navigate(`${RTests}/${item.id}`)} // Use RTests
                                        >
                                            <CardHeader className="p-4">
                                                <CardTitle
                                                    className="text-md font-semibold text-sky-700 dark:text-sky-500 truncate"
                                                    title={item.name}
                                                >
                                                    {item.name}
                                                </CardTitle>
                                                <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                                    ID: {item.id}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="p-4 pt-0 space-y-2 text-xs flex-grow">
                                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                    <CalendarDays
                                                        size={13}
                                                        className="mr-1.5 text-slate-500 dark:text-slate-400"
                                                    />
                                                    Created:{' '}
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                    {item.active ? (
                                                        <CheckSquare
                                                            size={13}
                                                            className="mr-1.5 text-green-500 dark:text-green-400"
                                                        />
                                                    ) : (
                                                        <XSquare
                                                            size={13}
                                                            className="mr-1.5 text-red-500 dark:text-red-400"
                                                        />
                                                    )}
                                                    Status: {item.active ? 'Active' : 'Inactive'}
                                                </div>
                                                {item.expiresAfter && (
                                                    <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                        <Clock
                                                            size={13}
                                                            className="mr-1.5 text-slate-500 dark:text-slate-400"
                                                        />
                                                        Expires:{' '}
                                                        {new Date(
                                                            item.expiresAfter
                                                        ).toLocaleString()}
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
