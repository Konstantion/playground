import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { Action, actionStr } from '@/entities/Action.js';
import {
    CheckCircle,
    Edit,
    FileQuestion,
    Plus,
    Trash2,
    XCircle,
    Briefcase,
    Info,
    CalendarDays,
    ListChecks,
    Shuffle,
    Clock,
    Settings2,
    Link as LinkIcon,
    Search,
    FileWarning,
    Copy,
} from 'lucide-react';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import Header from '@/components/Header.jsx';
import { RHome, RLogin, RQuestions } from '@/rout/Routes.jsx';
import { between } from '@/utils/Strings.js';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function TestModelDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const [model, setModel] = useState(null);
    const [status, setStatus] = useState('loading');
    const [availableQuestions, setAvailableQuestions] = useState([]);
    const [searchAvailable, setSearchAvailable] = useState('');

    const [isAddQuestionDialogOpen, setIsAddQuestionDialogOpen] = useState(false);
    const [isAddingQuestionToModel, setIsAddingQuestionToModel] = useState(false);

    const [isEditNameDialogOpen, setIsEditNameDialogOpen] = useState(false);
    const [draftModelName, setDraftModelName] = useState('');

    const [expiresAfter, setExpiresAfter] = useState('');
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [shuffleVariants, setShuffleVariants] = useState(false);
    const [isSavingConfiguration, setIsSavingConfiguration] = useState(false);

    const [isImmutableTestCreatedDialogOpen, setIsImmutableTestCreatedDialogOpen] = useState(false);
    const [createdImmutableTestId, setCreatedImmutableTestId] = useState(null);

    useEffect(() => {
        if (!id) {
            setStatus('notfound');
            return;
        }
        const fetchModelData = async () => {
            setStatus('loading');
            await authenticatedReq(
                `${Endpoints.TestModel.Base}/${id}`,
                'GET',
                null,
                auth.accessToken,
                (type, msg) => {
                    setStatus('notfound');
                    toast.error(`Failed to load model: ${msg || 'Unknown error'}`, {
                        duration: 4000,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RLogin);
                    }
                },
                data => {
                    setModel(data);
                    setDraftModelName(data.name || '');

                    setExpiresAfter(data.expiresAfter ? String(data.expiresAfter / 60000) : '');
                    setShuffleQuestions(data.shuffleQuestions || false);
                    setShuffleVariants(data.shuffleVariants || false);
                    setStatus('loaded');
                    document.title = `${data.name || 'Test Model'} - Playground`;
                }
            );
        };
        fetchModelData();
    }, [id, auth.accessToken, logout, navigate]);

    const filteredAvailableQuestions = useMemo(() => {
        if (!model || !Array.isArray(availableQuestions)) return [];
        const existingQuestionIds = new Set(model.questions.map(q => q.id));
        return availableQuestions.filter(
            q =>
                !existingQuestionIds.has(q.id) &&
                (q.body || q.name || `Question ID: ${q.id}`)
                    .toLowerCase()
                    .includes(searchAvailable.toLowerCase())
        );
    }, [availableQuestions, model, searchAvailable]);

    const updateModelDetails = async (patchBody, successMessage, failureMessage) => {
        setIsSavingConfiguration(true);
        const result = await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(failureMessage || `Operation failed: ${message || 'Unknown error'}`, {
                    duration: 4000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
                setIsSavingConfiguration(false);
                return false;
            },
            updatedModel => {
                setModel(updatedModel);

                if (patchBody.name) setDraftModelName(updatedModel.name || '');
                toast.success(successMessage || 'Model updated successfully!', { duration: 3000 });
                setIsSavingConfiguration(false);
                return true;
            }
        );
        return result;
    };

    const handleSaveModelName = async () => {
        if (!between(draftModelName.trim(), 1, 50)) {
            toast.error('Model name must be 1-50 characters.', { duration: 3000 });
            return;
        }
        const success = await updateModelDetails(
            { action: actionStr(Action.ADD), name: draftModelName.trim() },
            'Model name updated successfully!',
            'Failed to update model name.'
        );
        if (success) setIsEditNameDialogOpen(false);
    };

    const handleCreateImmutableTest = async () => {
        setIsSavingConfiguration(true);
        const expiresValueMs =
            expiresAfter && parseInt(expiresAfter, 10) > 0
                ? parseInt(expiresAfter, 10) * 60000
                : null;

        const body = {
            testModelId: id,
            expiresAfter: expiresValueMs,
            shuffleQuestions: shuffleQuestions,
            shuffleVariants: shuffleVariants,
        };

        await authenticatedReq(
            Endpoints.ImmutableTest.Base,
            'POST',
            body,
            auth.accessToken,
            (type, message) => {
                toast.error(`Failed to create immutable test: ${message || 'Unknown error'}`, {
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
                setIsSavingConfiguration(false);
            },
            immutableTest => {
                toast.success(`Immutable Test (ID: ${immutableTest.id}) created successfully!`, {
                    duration: 4000,
                });
                setCreatedImmutableTestId(immutableTest.id);
                setIsImmutableTestCreatedDialogOpen(true);

                setIsSavingConfiguration(false);
            }
        );
    };

    const modifyQuestionInModel = async (actionType, questionId) => {
        if (actionType === Action.ADD) setIsAddingQuestionToModel(true);

        const patchBody = { action: actionStr(actionType), questionId: questionId };
        await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(`Operation failed: ${message || 'Unknown error'}`, { duration: 4000 });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
                if (actionType === Action.ADD) setIsAddingQuestionToModel(false);
            },
            updatedModel => {
                setModel(updatedModel);
                toast.success(
                    `Question ${actionType === Action.ADD ? 'added to' : 'removed from'} model.`,
                    { duration: 3000 }
                );
                if (actionType === Action.ADD) {
                    setAvailableQuestions(prev => prev.filter(q => q.id !== questionId));
                    setIsAddingQuestionToModel(false);
                }
            }
        );
    };

    const fetchAvailableQuestionsForDialog = async () => {
        if (availableQuestions.length > 0 && isAddQuestionDialogOpen) {
            return;
        }
        await authenticatedReq(
            Endpoints.Questions.GetAll,
            'GET',
            null,
            auth.accessToken,
            (type, message) => {
                toast.error(`Failed to load available questions: ${message || 'Unknown error'}`, {
                    duration: 4000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
            },
            data => {
                const questionsData = Array.isArray(data) ? data : [];
                setAvailableQuestions(
                    questionsData.map(q => ({
                        id: q.id,
                        name: q.body || `Question ID: ${q.id}`,
                        validated: q.validated,
                        createdAt: q.createdAt,
                        lang: q.lang,
                    }))
                );
            }
        );
    };

    const handleOpenAddQuestionDialog = () => {
        setIsAddQuestionDialogOpen(true);
        fetchAvailableQuestionsForDialog();
    };

    const copyToClipboard = text => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                toast.success('Test ID copied to clipboard!', { duration: 2000 });
            })
            .catch(err => {
                toast.error('Failed to copy Test ID.', { duration: 2000 });
            });
    };

    if (status === 'loading')
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <Loading message="Loading test model details..." />
            </div>
        );
    if (status === 'notfound' || !model)
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />
                <NotFound message="Test model not found." />
            </div>
        );

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <main className="flex-1 p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 xl:gap-8 items-start">
                    {/* Left Column: Model Details & Test Configuration */}
                    <div className="xl:col-span-4 flex flex-col gap-6 xl:gap-8">
                        {/* Model Details Card */}
                        <Card className="shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <Briefcase
                                            size={22}
                                            className="mr-3 text-sky-600 dark:text-sky-500"
                                        />
                                        <div>
                                            <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
                                                {model.name || 'Test Model'}
                                            </CardTitle>
                                            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                                ID: {model.id}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Dialog
                                        open={isEditNameDialogOpen}
                                        onOpenChange={setIsEditNameDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-500 hover:text-sky-600 dark:hover:text-sky-500 h-8 w-8 rounded-full"
                                            >
                                                <Edit size={16} />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="dark:bg-slate-800">
                                            <DialogHeader>
                                                <DialogTitle className="dark:text-slate-100">
                                                    Edit Model Name
                                                </DialogTitle>
                                            </DialogHeader>
                                            <Input
                                                value={draftModelName}
                                                onChange={e => setDraftModelName(e.target.value)}
                                                className="my-4 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                                placeholder="Enter new model name"
                                                maxLength={50}
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button
                                                        variant="outline"
                                                        className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </DialogClose>
                                                <Button
                                                    onClick={handleSaveModelName}
                                                    className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                                                >
                                                    Save Name
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 pt-0">
                                <div className="flex items-center">
                                    <CalendarDays
                                        size={14}
                                        className="mr-2 text-slate-500 dark:text-slate-400"
                                    />{' '}
                                    Created: {new Date(model.createdAt).toLocaleString()}
                                </div>
                                <div className="flex items-center">
                                    <ListChecks
                                        size={14}
                                        className="mr-2 text-slate-500 dark:text-slate-400"
                                    />{' '}
                                    Questions: {model.questions?.length || 0}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Test Configuration Card */}
                        <Card className="shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center">
                                    <Settings2
                                        size={20}
                                        className="mr-3 text-sky-600 dark:text-sky-500"
                                    />
                                    <div>
                                        <CardTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                                            Test Configuration
                                        </CardTitle>
                                        <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                            Settings for generating an immutable test.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div>
                                    <Label
                                        htmlFor="expiresAfter"
                                        className="font-medium text-slate-700 dark:text-slate-300 flex items-center"
                                    >
                                        <Clock
                                            size={14}
                                            className="mr-1.5 text-slate-500 dark:text-slate-400"
                                        />{' '}
                                        Duration (minutes)
                                    </Label>
                                    <Input
                                        id="expiresAfter"
                                        type="number"
                                        value={expiresAfter}
                                        onChange={e => setExpiresAfter(e.target.value)}
                                        placeholder="e.g., 60 (0 for no limit)"
                                        className="mt-1.5 w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500"
                                        min="0"
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-1">
                                    <Checkbox
                                        id="shuffleQuestions"
                                        checked={shuffleQuestions}
                                        onCheckedChange={setShuffleQuestions}
                                        className="dark:border-slate-600 data-[state=checked]:dark:bg-sky-600 data-[state=checked]:border-sky-600"
                                    />
                                    <Label
                                        htmlFor="shuffleQuestions"
                                        className="font-medium text-slate-700 dark:text-slate-300 flex items-center cursor-pointer"
                                    >
                                        <Shuffle
                                            size={14}
                                            className="mr-1.5 text-slate-500 dark:text-slate-400"
                                        />{' '}
                                        Shuffle Questions
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="shuffleVariants"
                                        checked={shuffleVariants}
                                        onCheckedChange={setShuffleVariants}
                                        className="dark:border-slate-600 data-[state=checked]:dark:bg-sky-600 data-[state=checked]:border-sky-600"
                                    />
                                    <Label
                                        htmlFor="shuffleVariants"
                                        className="font-medium text-slate-700 dark:text-slate-300 flex items-center cursor-pointer"
                                    >
                                        <Shuffle
                                            size={14}
                                            className="mr-1.5 text-slate-500 dark:text-slate-400"
                                        />{' '}
                                        Shuffle Variants
                                    </Label>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={handleCreateImmutableTest}
                                    disabled={
                                        isSavingConfiguration || model.questions?.length === 0
                                    }
                                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white"
                                    title={
                                        model.questions?.length === 0
                                            ? 'Add questions to the model first'
                                            : ''
                                    }
                                >
                                    {isSavingConfiguration
                                        ? 'Creating Test...'
                                        : 'Create Immutable Test'}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    {/* Right Column: Questions in Model */}
                    <div className="xl:col-span-8">
                        <Card className="shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col min-h-[calc(100vh-180px)] md:min-h-0">
                            <CardHeader className="pb-4 border-b dark:border-slate-700/50">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <ListChecks
                                            size={22}
                                            className="mr-3 text-sky-600 dark:text-sky-500"
                                        />
                                        <div>
                                            <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 dark:text-slate-100">
                                                Questions in Model
                                            </CardTitle>
                                            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                                                Manage the questions included in this test model.
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={handleOpenAddQuestionDialog}
                                        className="dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                                    >
                                        <Plus className="mr-2 h-4 w-4" /> Add Question
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 p-0 overflow-hidden">
                                {model.questions.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-10">
                                        <FileQuestion
                                            className="h-16 w-16 text-slate-400 dark:text-slate-500 mb-4"
                                            strokeWidth={1.5}
                                        />
                                        <h3 className="text-lg font-medium text-slate-700 dark:text-slate-200">
                                            No Questions Yet
                                        </h3>
                                        <p className="mt-1 text-sm">
                                            This model is empty. Click "Add Question" to get
                                            started.
                                        </p>
                                    </div>
                                ) : (
                                    <ScrollArea className="h-[calc(100vh-320px)] md:h-auto md:max-h-[calc(100vh-280px)] xl:max-h-[70vh]">
                                        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 p-4 sm:p-5">
                                            {model.questions.map(q => (
                                                <Card
                                                    key={q.id}
                                                    className="flex flex-col dark:bg-slate-850 dark:hover:bg-slate-700/70 border dark:border-slate-700 rounded-lg overflow-hidden transition-all hover:shadow-md"
                                                >
                                                    <CardHeader
                                                        className="p-3 space-y-1.5 flex-grow cursor-pointer"
                                                        onClick={() =>
                                                            navigate(`${RQuestions}/${q.id}`)
                                                        }
                                                    >
                                                        <h4
                                                            className="font-semibold text-sm text-sky-700 dark:text-sky-500 break-words leading-tight"
                                                            title={
                                                                q.body ||
                                                                q.name ||
                                                                `Question ID: ${q.id}`
                                                            }
                                                        >
                                                            {q.body ||
                                                                q.name ||
                                                                `Question ID: ${q.id}`}
                                                        </h4>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">
                                                            ID: {q.id}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent
                                                        className="p-3 pt-0 text-xs space-y-1 cursor-pointer"
                                                        onClick={() =>
                                                            navigate(`${RQuestions}/${q.id}`)
                                                        }
                                                    >
                                                        <Badge
                                                            variant={
                                                                q.validated
                                                                    ? 'default'
                                                                    : 'destructive'
                                                            }
                                                            className={cn(
                                                                'text-xs',
                                                                q.validated
                                                                    ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300 border-green-300 dark:border-green-700'
                                                                    : 'bg-red-100 text-red-700 dark:bg-red-700/30 dark:text-red-300 border-red-300 dark:border-red-700'
                                                            )}
                                                        >
                                                            {q.validated ? (
                                                                <CheckCircle
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                            ) : (
                                                                <XCircle
                                                                    size={12}
                                                                    className="mr-1"
                                                                />
                                                            )}
                                                            {q.validated
                                                                ? 'Validated'
                                                                : 'Not Validated'}
                                                        </Badge>
                                                        <div className="text-slate-500 dark:text-slate-400">
                                                            Lang: {q.lang || 'N/A'}
                                                        </div>
                                                    </CardContent>
                                                    <CardFooter className="p-2 border-t dark:border-slate-700/50">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="w-full justify-center text-red-600 hover:bg-red-100 dark:hover:bg-red-700/30 dark:text-red-500 dark:hover:text-red-400 text-xs"
                                                            onClick={() =>
                                                                modifyQuestionInModel(
                                                                    Action.REMOVE,
                                                                    q.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 size={13} className="mr-1.5" />{' '}
                                                            Remove from Model
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                        </div>
                                    </ScrollArea>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Dialog for Adding Questions to Model */}
            <Dialog open={isAddQuestionDialogOpen} onOpenChange={setIsAddQuestionDialogOpen}>
                <DialogContent className="max-w-2xl w-[95vw] sm:w-full dark:bg-slate-800 rounded-lg">
                    <DialogHeader className="pb-3">
                        <DialogTitle className="text-lg font-medium text-slate-900 dark:text-slate-50">
                            Add Questions to Model
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                            Select from available, validated questions. List updates after each
                            addition.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="relative my-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 dark:text-slate-500" />
                        <Input
                            type="search"
                            placeholder="Search available questions by name..."
                            value={searchAvailable}
                            onChange={e => setSearchAvailable(e.target.value)}
                            className="w-full pl-10 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                        />
                    </div>
                    <ScrollArea className="h-72 border dark:border-slate-700 rounded-md">
                        {filteredAvailableQuestions.length > 0 ? (
                            <ul className="space-y-1 p-2">
                                {filteredAvailableQuestions.map(q => (
                                    <li
                                        key={q.id}
                                        className="flex justify-between items-center p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-md transition-colors"
                                    >
                                        <div className="flex flex-col overflow-hidden mr-2">
                                            <span
                                                className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate"
                                                title={q.name}
                                            >
                                                {q.name}
                                            </span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                                Lang: {q.lang || 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex items-center space-x-2 flex-shrink-0">
                                            <Badge
                                                variant={q.validated ? 'default' : 'secondary'}
                                                className={cn(
                                                    'text-xs py-0.5 px-1.5',
                                                    q.validated
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-700/30 dark:text-green-300'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                                                )}
                                            >
                                                {q.validated ? (
                                                    <CheckCircle size={12} className="mr-1" />
                                                ) : (
                                                    <Info size={12} className="mr-1" />
                                                )}
                                                {q.validated ? 'Valid' : 'Not Valid'}
                                            </Badge>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    modifyQuestionInModel(Action.ADD, q.id)
                                                }
                                                disabled={isAddingQuestionToModel}
                                                className="h-7 w-7 text-sky-600 hover:text-sky-700 dark:text-sky-500 dark:hover:text-sky-400"
                                                aria-label="Add question to model"
                                            >
                                                {isAddingQuestionToModel && (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                )}
                                                {!isAddingQuestionToModel && (
                                                    <Plus className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500 dark:text-slate-400">
                                <FileWarning
                                    size={40}
                                    className="text-slate-400 dark:text-slate-500 mb-3"
                                    strokeWidth={1.5}
                                />
                                <p className="text-sm font-medium">
                                    {searchAvailable
                                        ? 'No matching questions found.'
                                        : availableQuestions.length === 0 &&
                                            model.questions.length > 0
                                          ? 'All available questions are in the model.'
                                          : 'No questions available or all are added.'}
                                </p>
                                <p className="text-xs mt-1">
                                    {searchAvailable
                                        ? 'Try a different search term.'
                                        : 'You might need to create more questions or check your filters.'}
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                    <DialogFooter className="mt-5">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-700"
                            >
                                Done
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog for Immutable Test Created Confirmation */}
            <Dialog
                open={isImmutableTestCreatedDialogOpen}
                onOpenChange={setIsImmutableTestCreatedDialogOpen}
            >
                <DialogContent className="dark:bg-slate-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center text-green-600 dark:text-green-400">
                            <CheckCircle className="mr-2" /> Immutable Test Created!
                        </DialogTitle>
                        <DialogDescription className="dark:text-slate-400 pt-2">
                            A new immutable test has been successfully generated from this model.
                        </DialogDescription>
                    </DialogHeader>
                    {createdImmutableTestId && (
                        <div className="my-4 p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                            <Label className="text-xs text-slate-600 dark:text-slate-400">
                                Generated Test ID:
                            </Label>
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-sm font-mono text-sky-700 dark:text-sky-400 break-all">
                                    {createdImmutableTestId}
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => copyToClipboard(createdImmutableTestId)}
                                    className="h-7 w-7 text-slate-500 hover:text-sky-600"
                                >
                                    <Copy size={14} />
                                </Button>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                                You can now share this ID with students or use it for test
                                administration.
                            </p>
                        </div>
                    )}
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
