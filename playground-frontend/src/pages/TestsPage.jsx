import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { RTests } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import {
    Archive,
    CalendarDays,
    CheckCircle,
    ClipboardList,
    Clock,
    FileWarning,
    Filter,
    Loader2,
    RefreshCw,
    Search,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const ImmutableTestStatus = {
    ACTIVE: 'ACTIVE',
    ARCHIVED: 'ARCHIVED',
};

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

const filterOptions = [
    { value: 'ALL', label: 'All Statuses' },
    { value: ImmutableTestStatus.ACTIVE, label: 'Active' },
    { value: ImmutableTestStatus.ARCHIVED, label: 'Archived' },
];

export default function TestsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [allTests, setAllTests] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentFilter, setCurrentFilter] = useState('ALL');

    const fetchTests = useCallback(async () => {
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
                if (type === ErrorType.TokenExpired) logout();
            },
            data => {
                const testsData = Array.isArray(data) ? data : [];

                setAllTests(
                    testsData.map(t => ({
                        id: t.id,
                        name: t.name,
                        status: t.status,
                        createdAt: t.createdAt,
                        expiresAfter: t.expiresAfter,
                    }))
                );
                setLoading(false);
            }
        );
    }, [auth.accessToken, logout]);

    useEffect(() => {
        fetchTests();
    }, [fetchTests]);

    const filteredTests = useMemo(() => {
        return allTests.filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
            const matchesFilter = currentFilter === 'ALL' || t.status === currentFilter;
            return matchesSearch && matchesFilter;
        });
    }, [allTests, search, currentFilter]);

    return (
        <div className="grid grid-cols-1 gap-6 xl:gap-8 p-4 md:p-6">
            {' '}
            <div className="col-span-1">
                <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4 border-b dark:border-slate-700">
                        {' '}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center">
                                <ClipboardList
                                    size={24}
                                    className="mr-3 text-sky-600 dark:text-sky-500 flex-shrink-0"
                                />
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                        Tests
                                    </CardTitle>
                                    <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                        Browse previously generated tests. ({filteredTests.length}{' '}
                                        found)
                                    </CardDescription>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchTests}
                                disabled={loading}
                                aria-label="Refresh tests"
                                className="dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 dark:border-slate-600"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="relative flex-grow">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                                <Input
                                    type="search"
                                    placeholder="Search tests by name..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="w-full pl-10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                                />
                            </div>

                            <div className="flex items-center flex-wrap gap-2">
                                <Filter className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-1 hidden sm:block" />
                                {filterOptions.map(option => (
                                    <Button
                                        key={option.value}
                                        variant={
                                            currentFilter === option.value ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        onClick={() => setCurrentFilter(option.value)}
                                        className={cn(
                                            'transition-colors',
                                            currentFilter !== option.value &&
                                                'dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-300 dark:border-slate-600'
                                        )}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <Loading message="Loading tests..." />
                        ) : filteredTests.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <FileWarning
                                    size={48}
                                    className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                                />
                                <p className="font-semibold text-lg">No Tests Found</p>
                                <p className="text-sm mt-1">
                                    {search || currentFilter !== 'ALL'
                                        ? 'Try adjusting your search or filter.'
                                        : 'Generate tests from the Test Models page.'}
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[calc(100vh-380px)] min-h-[400px] pr-1">
                                {' '}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredTests.map(item => {
                                        const statusProps = getStatusProps(item.status);
                                        return (
                                            <Card
                                                key={item.id}
                                                className="cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:bg-slate-850 dark:hover:bg-slate-700/70 border dark:border-slate-700 rounded-lg overflow-hidden flex flex-col"
                                                onClick={() => navigate(`${RTests}/${item.id}`)}
                                                aria-label={`View details for test ${item.name}`}
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
                                                            className="mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0"
                                                        />
                                                        Created:{' '}
                                                        {new Date(
                                                            item.createdAt
                                                        ).toLocaleDateString()}
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Badge
                                                            variant={statusProps.variant}
                                                            className={cn(
                                                                'text-xs py-0.5 px-1.5',
                                                                `bg-${statusProps.color}-100 text-${statusProps.color}-700 dark:bg-${statusProps.color}-700/30 dark:text-${statusProps.color}-300 border-${statusProps.color}-300 dark:border-${statusProps.color}-700`
                                                            )}
                                                        >
                                                            <statusProps.icon
                                                                size={12}
                                                                className="mr-1"
                                                            />
                                                            {statusProps.text}
                                                        </Badge>
                                                    </div>
                                                    {item.expiresAfter && (
                                                        <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                            <Clock
                                                                size={13}
                                                                className="mr-1.5 text-slate-500 dark:text-slate-400 flex-shrink-0"
                                                            />
                                                            Expires:{' '}
                                                            {new Date(
                                                                item.expiresAfter
                                                            ).toLocaleString()}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
