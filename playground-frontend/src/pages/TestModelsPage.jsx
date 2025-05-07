import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Routes as RRoutes, RTestModels } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import { between } from '@/utils/Strings.js';
import { Briefcase, CalendarDays, FileWarning, PlusCircle, Search } from 'lucide-react';

export default function TestModelsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [modelName, setModelName] = useState('');
    const [models, setModels] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchModels = async () => {
            setLoading(true);
            await authenticatedReq(
                Endpoints.TestModel.Base,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setLoading(false);
                    toast.error(message || 'Failed to load test models.', {
                        closeButton: true,
                        duration: 5000,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                data => {
                    const modelsData = Array.isArray(data) ? data : [];
                    setModels(
                        modelsData.map(m => ({
                            id: m.id,
                            name: m.name,
                            createdAt: m.createdAt,
                            questionCount: m.questions?.length || 0,
                        }))
                    );
                    setLoading(false);
                }
            );
        };
        fetchModels();
    }, [auth.accessToken, logout, navigate]);

    const handleCreate = async () => {
        if (!between(modelName.trim(), 1, 50)) {
            toast.error('Model name must be 1-50 characters.', {
                closeButton: true,
                duration: 3000,
            });
            return;
        }
        setIsCreating(true);
        await authenticatedReq(
            Endpoints.TestModel.Base,
            'POST',
            { name: modelName.trim() },
            auth.accessToken,
            (type, message) => {
                toast.error(message || 'Failed to create test model.', {
                    closeButton: true,
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
                setIsCreating(false);
            },
            created => {
                toast.success(`Test model "${created.name}" created successfully!`, {
                    duration: 3000,
                });
                setModelName('');

                setModels(prev => [
                    ...prev,
                    {
                        id: created.id,
                        name: created.name,
                        createdAt: created.createdAt,
                        questionCount: created.questions?.length || 0,
                    },
                ]);
                setIsCreating(false);
            }
        );
    };

    const filteredModels = useMemo(
        () => models.filter(m => m.name.toLowerCase().includes(search.toLowerCase())),
        [models, search]
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
            {/* Section for creating a new Test Model */}
            <Card className="lg:col-span-1 shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                <CardHeader className="pb-4">
                    <div className="flex items-center">
                        <PlusCircle size={24} className="mr-3 text-sky-600 dark:text-sky-500" />
                        <div>
                            <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                Create Test Model
                            </CardTitle>
                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                Group questions into a reusable model.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="model-name"
                            className="text-sm font-medium text-slate-700 dark:text-slate-300"
                        >
                            Model Name
                        </label>
                        <Input
                            id="model-name"
                            value={modelName}
                            onChange={e => setModelName(e.target.value)}
                            placeholder="e.g., Midterm Exam Model"
                            className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                            maxLength={50}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        onClick={handleCreate}
                        className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                        disabled={isCreating}
                    >
                        {isCreating ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Creating...
                            </div>
                        ) : (
                            <>
                                <PlusCircle size={18} className="mr-2" /> Create Model
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {/* Section for displaying existing Test Models */}
            <div className="lg:col-span-2 space-y-5">
                <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center">
                            <Briefcase size={24} className="mr-3 text-sky-600 dark:text-sky-500" />
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    Existing Test Models
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    Browse and manage your created models. ({filteredModels.length}{' '}
                                    found)
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                                type="search"
                                placeholder="Search models by name..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        {loading ? (
                            <Loading message="Loading models..." />
                        ) : filteredModels.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <FileWarning
                                    size={48}
                                    className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                                />
                                <p className="font-semibold text-lg">No Test Models Found</p>
                                <p className="text-sm mt-1">
                                    {search
                                        ? 'Try adjusting your search term.'
                                        : 'Create a new test model to get started!'}
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[calc(100vh-380px)] min-h-[300px] pr-1">
                                {' '}
                                {/* Adjusted height */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredModels.map(item => (
                                        <Card
                                            key={item.id}
                                            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:bg-slate-850 dark:hover:bg-slate-700/70 border dark:border-slate-700 rounded-lg overflow-hidden"
                                            onClick={() => navigate(`${RTestModels}/${item.id}`)}
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
                                            <CardContent className="p-4 pt-0 space-y-2 text-xs">
                                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                    <CalendarDays
                                                        size={13}
                                                        className="mr-1.5 text-slate-500 dark:text-slate-400"
                                                    />
                                                    Created:{' '}
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                    <Briefcase
                                                        size={13}
                                                        className="mr-1.5 text-slate-500 dark:text-slate-400"
                                                    />
                                                    Questions:{' '}
                                                    {item.questionCount !== undefined
                                                        ? item.questionCount
                                                        : 'N/A'}
                                                </div>
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
