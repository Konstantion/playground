import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Lang } from '@/entities/Lang';
import {
    CalendarDays,
    CheckCircle,
    FileQuestion,
    FileUp,
    FileWarning,
    Languages,
    PlusCircle,
    Search,
    XCircle,
} from 'lucide-react';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Routes as RRoutes, RQuestions } from '@/rout/Routes.jsx';
import Loading from '@/components/Loading.jsx';
import { between, blank } from '@/utils/Strings.js';
import { Badge } from '@/components/ui/badge';
import { Role } from '@/entities/Role.js';

const QuestionsPage = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [questionName, setQuestionName] = useState('');
    const [questionLang, setQuestionLang] = useState(Object.values(Lang)[0] || '');
    const [search, setSearch] = useState('');
    const [dataItems, setDataItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setLoading(true);
            const endpoint =
                auth?.user?.role === Role.Admin
                    ? Endpoints.Questions.GetAll
                    : Endpoints.Questions.Base;
            await authenticatedReq(
                endpoint,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setLoading(false);
                    toast.error(message || 'Failed to load questions.', {
                        closeButton: true,
                        duration: 5000,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                questions => {
                    const questionsData = Array.isArray(questions) ? questions : [];
                    const converted = questionsData.map(convert);
                    setDataItems(converted);
                    setLoading(false);
                }
            );
        };

        fetchQuestions();
    }, [auth.accessToken, logout, navigate]);

    const handleCreateQuestion = async () => {
        if (!between(questionName.trim(), 1, 100)) {
            toast.error('Question name must be 1-100 characters.', {
                closeButton: true,
                duration: 3000,
            });
            return;
        } else if (blank(questionLang)) {
            toast.error('Please select a language for the question.', {
                closeButton: true,
                duration: 3000,
            });
            return;
        }

        setIsCreating(true);
        await authenticatedReq(
            Endpoints.Questions.Base,
            'POST',
            { body: questionName.trim(), lang: questionLang },
            auth.accessToken,
            (type, message) => {
                toast.error(message || 'Failed to create question.', {
                    closeButton: true,
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
                setIsCreating(false);
            },
            question => {
                toast.success(`Question "${question.body}" created successfully!`, {
                    duration: 3000,
                });
                setQuestionName('');
                setDataItems(prev => [...prev, convert(question)]);
                setIsCreating(false);
            }
        );
    };

    const triggerFileInput = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelectedForImport = async event => {
        const file = event.target.files[0];

        if (event.target) {
            event.target.value = null;
        }

        if (!file) return;

        if (file.type !== 'application/json') {
            toast.error('Invalid file type. Please select a JSON file (.json).');
            return;
        }

        setIsImporting(true);
        const reader = new FileReader();

        reader.onload = async e => {
            try {
                const fileContent = e.target.result;
                const questionJson = JSON.parse(fileContent);

                await authenticatedReq(
                    `${Endpoints.Questions.Base}/import`,
                    'POST',
                    questionJson,
                    auth.accessToken,
                    (type, message) => {
                        toast.error(message || 'Failed to import question.', {
                            duration: 5000,
                            closeButton: true,
                        });
                        if (type === ErrorType.TokenExpired) {
                            logout();
                            navigate(RRoutes.Login.path);
                        }
                        setIsImporting(false);
                    },
                    importedQuestion => {
                        toast.success(
                            `Question "${importedQuestion.body || 'ID: ' + importedQuestion.id}" imported successfully!`,
                            { duration: 3000 }
                        );
                        setDataItems(prev => {
                            const exists = prev.some(item => item.id === importedQuestion.id);
                            return exists
                                ? prev.map(item =>
                                      item.id === importedQuestion.id
                                          ? convert(importedQuestion)
                                          : item
                                  )
                                : [...prev, convert(importedQuestion)];
                        });
                        setIsImporting(false);
                    }
                );
            } catch (error) {
                toast.error("Failed to read or parse JSON file. Ensure it's valid JSON.", {
                    duration: 5000,
                });
                setIsImporting(false);
            }
        };

        reader.onerror = () => {
            toast.error('Failed to read file.', { duration: 5000 });
            setIsImporting(false);
        };

        reader.readAsText(file);
    };

    const convert = question => ({
        id: question.id,
        name: question.body,
        validated: question.validated,
        lang: question.lang,
        date: new Date(question.createdAt).toLocaleDateString(),
    });

    const filteredItems = useMemo(
        () =>
            dataItems.filter(
                item =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.lang.toLowerCase().includes(search.toLowerCase())
            ),
        [dataItems, search]
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 xl:gap-8 items-start">
            {/* Column 1: Create and Import */}
            <div className="lg:col-span-1 flex flex-col gap-6 xl:gap-8">
                {/* Section for creating a new Question */}
                <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center">
                            <PlusCircle size={24} className="mr-3 text-sky-600 dark:text-sky-500" />
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    Create Question
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    Add a new question to the library.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="question-name"
                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Question Name
                            </label>
                            <Input
                                id="question-name"
                                value={questionName}
                                onChange={e => setQuestionName(e.target.value)}
                                placeholder="e.g., What is the output of..."
                                className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                                maxLength={100}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label
                                htmlFor="question-lang"
                                className="text-sm font-medium text-slate-700 dark:text-slate-300"
                            >
                                Language
                            </label>
                            <Select value={questionLang} onValueChange={setQuestionLang}>
                                <SelectTrigger
                                    id="question-lang"
                                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-slate-700 dark:text-slate-200">
                                    {Object.values(Lang).map(lang => (
                                        <SelectItem key={lang} value={lang}>
                                            {lang}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleCreateQuestion}
                            className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                            disabled={isCreating}
                        >
                            {isCreating ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        /* Spinner SVG */ className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    <PlusCircle size={18} className="mr-2" /> Create Question
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>

                {/* NEW Section for importing a Question from File */}
                <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center">
                            <FileUp
                                size={24}
                                className="mr-3 text-indigo-600 dark:text-indigo-500"
                            />
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    Import Question
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    Upload a question from a JSON file.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelectedForImport}
                            accept=".json,application/json"
                            className="hidden"
                            disabled={isImporting}
                        />
                        <Button
                            onClick={triggerFileInput}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                            disabled={isImporting}
                        >
                            {isImporting ? (
                                <div className="flex items-center justify-center">
                                    <svg
                                        /* Spinner SVG */ className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                    Importing...
                                </div>
                            ) : (
                                <>
                                    <FileUp size={18} className="mr-2" /> Choose File & Import
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Section for displaying existing Questions */}
            <div className="lg:col-span-2 space-y-5">
                <Card className="shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center">
                            <FileQuestion
                                size={24}
                                className="mr-3 text-sky-600 dark:text-sky-500"
                            />
                            <div>
                                <CardTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                    Existing Questions
                                </CardTitle>
                                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                    Browse and manage your questions. ({filteredItems.length} of{' '}
                                    {dataItems.length} shown)
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                            <Input
                                type="search"
                                placeholder="Search by name or language..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="w-full pl-10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                            />
                        </div>

                        {loading ? (
                            <Loading message="Loading questions..." />
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                                <FileWarning
                                    size={48}
                                    className="mx-auto mb-4 text-slate-400 dark:text-slate-500"
                                />
                                <p className="font-semibold text-lg">No Questions Found</p>
                                <p className="text-sm mt-1">
                                    {search
                                        ? 'Try adjusting your search term.'
                                        : dataItems.length === 0
                                          ? 'Create or import a question to get started!'
                                          : 'No questions match your current search.'}
                                </p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[calc(100vh-420px)] min-h-[300px] pr-1">
                                {' '}
                                {/* Adjusted height if needed */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {filteredItems.map(item => (
                                        <Card
                                            key={item.id}
                                            className="cursor-pointer hover:shadow-lg transition-shadow duration-200 dark:bg-slate-850 dark:hover:bg-slate-700/70 border dark:border-slate-700 rounded-lg overflow-hidden"
                                            onClick={() => navigate(`${RQuestions}/${item.id}`)}
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
                                                    <Languages
                                                        size={13}
                                                        className="mr-1.5 text-slate-500 dark:text-slate-400"
                                                    />
                                                    Language:{' '}
                                                    <Badge
                                                        variant="outline"
                                                        className="ml-1.5 text-xs px-1.5 py-0.5 dark:border-slate-600 dark:text-slate-300"
                                                    >
                                                        {item.lang}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                    <CalendarDays
                                                        size={13}
                                                        className="mr-1.5 text-slate-500 dark:text-slate-400"
                                                    />
                                                    Created: {item.date}
                                                </div>
                                                <div className="flex items-center text-slate-600 dark:text-slate-300">
                                                    {item.validated ? (
                                                        <CheckCircle
                                                            size={13}
                                                            className="mr-1.5 text-green-500 dark:text-green-400"
                                                        />
                                                    ) : (
                                                        <XCircle
                                                            size={13}
                                                            className="mr-1.5 text-red-500 dark:text-red-400"
                                                        />
                                                    )}
                                                    Validated: {item.validated ? 'Yes' : 'No'}
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
};

export default QuestionsPage;
