import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger, // Keep for explicit triggers
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Assuming shadcn/ui Label
import { Checkbox } from '@/components/ui/checkbox'; // Assuming shadcn/ui Checkbox
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { Action, actionStr } from '@/entities/Action.js';
import { CheckCircle, Trash2, Plus, XCircle, FileQuestion, Edit, Save } from 'lucide-react'; // Added Edit, Save
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import Header from '@/components/Header.jsx';
import { RHome, RLogin } from '@/rout/Routes.jsx';

export default function TestModelDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth, logout } = useAuth();

    const [model, setModel] = useState(null);
    const [status, setStatus] = useState('loading');
    const [available, setAvailable] = useState([]);
    const [search, setSearch] = useState('');

    // States for "Add Question" Dialog
    const [addOpen, setAddOpen] = useState(false);
    const [addingQuestion, setAddingQuestion] = useState(false);

    // States for "Edit Model Name" Dialog
    const [isEditNameOpen, setIsEditNameOpen] = useState(false);
    const [draftModelName, setDraftModelName] = useState('');

    // States for "Test Configuration" Form
    const [expiresAfter, setExpiresAfter] = useState(''); // Stored as string to allow empty input
    const [shuffleQuestions, setShuffleQuestions] = useState(false);
    const [shuffleVariants, setShuffleVariants] = useState(false);
    const [savingConfiguration, setSavingConfiguration] = useState(false);

    // State for "Create Actual Test" Dialog (as before)
    const [createOpen, setCreateOpen] = useState(false);


    // Effect to fetch model details and initialize form states
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
                    toast.error(`Failed to load model: ${msg}`);
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RLogin);
                    }
                },
                data => {
                    setModel(data);
                    setDraftModelName(data.name || '');
                    // Initialize configuration form states
                    setExpiresAfter(data.expiresAfter ? String(data.expiresAfter) : '');
                    setShuffleQuestions(data.shuffleQuestions || false);
                    setShuffleVariants(data.shuffleVariants || false);
                    setStatus('loaded');
                }
            );
        };
        fetchModelData();
    }, [id, auth.accessToken, logout, navigate]);

    // Memoized list of filtered questions for the "Add Question" dialog
    const filteredAvailableQuestions = useMemo(() => {
        if (!model) return [];
        const existingQuestionIds = new Set(model.questions.map(q => q.id));
        return available.filter(
            q =>
                !existingQuestionIds.has(q.id) &&
                (q.name || '').toLowerCase().includes(search.toLowerCase())
        );
    }, [available, model, search]);

    // Function to make PATCH requests for model updates (name, config, questions)
    const updateModelDetails = async (patchBody, successMessage) => {
        // Generic function to handle PATCH requests for the model
        // You'll need to define what 'action' and other properties your backend expects for name/config changes
        await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(`Operation failed: ${message}`);
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
                return false; // Indicate failure
            },
            updatedModel => {
                setModel(updatedModel); // Update the local model state
                // Update specific draft/form states if necessary based on updatedModel
                setDraftModelName(updatedModel.name || '');
                setExpiresAfter(updatedModel.expiresAfter ? String(updatedModel.expiresAfter) : '');
                setShuffleQuestions(updatedModel.shuffleQuestions || false);
                setShuffleVariants(updatedModel.shuffleVariants || false);

                toast.success(successMessage);
                return true; // Indicate success
            }
        );
    };

    // Handler to save the model name
    const handleSaveModelName = async () => {
        if (!draftModelName.trim()) {
            toast.error("Model name cannot be empty.");
            return;
        }
        // Construct the body specific to updating the name
        // This is an example; adjust to your backend's expected format
        const body = { action: 'UPDATE_NAME', name: draftModelName };

        // Replace this with your actual API call structure for updating the name
        console.log("Attempting to save model name:", draftModelName, "with body:", body);
        // Example of how you might call a generic update function:
        // await updateModelDetails(body, "Model name updated successfully!");

        // For now, simulate success and update local state:
        setModel(prev => ({ ...prev, name: draftModelName }));
        toast.success("Model name updated (simulated)!");
        setIsEditNameOpen(false);
    };


    // Handler to save test configuration
    const handleSaveConfiguration = async () => {
        setSavingConfiguration(true);
        const expiresValue = expiresAfter && parseInt(expiresAfter, 10) > 0 ? parseInt(expiresAfter, 10) : null;

        // Construct the body specific to updating configuration
        // This is an example; adjust to your backend's expected format
        const body = {
            action: 'UPDATE_CONFIG', // Example action type
            expiresAfter: expiresValue,
            shuffleQuestions: shuffleQuestions,
            shuffleVariants: shuffleVariants,
        };

        // Replace this with your actual API call structure for updating config
        console.log("Attempting to save configuration:", body);
        // Example of how you might call a generic update function:
        // await updateModelDetails(body, "Configuration updated successfully!");

        // For now, simulate success and update local state:
        setModel(prev => ({ ...prev, ...body })); // Spread body for simulation
        toast.success("Configuration updated (simulated)!");
        setSavingConfiguration(false);
    };


    // Function to add or remove a question from the model
    const modifyQuestionInModel = async (action, questionId) => {
        const patchBody = { action: actionStr(action), questionId: questionId };
        setAddingQuestion(true); // Use for add operation specifically
        await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(`Operation failed: ${message}`);
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
                if (action === Action.ADD) setAddingQuestion(false);
            },
            updatedModel => {
                setModel(updatedModel);
                toast.success(
                    `Question ${action === Action.ADD ? 'added to' : 'removed from'} model successfully!`
                );
                if (action === Action.ADD) {
                    // Refresh available questions to reflect the change in the dialog
                    fetchAvailableQuestions();
                    setAddingQuestion(false);
                }
            }
        );
    };

    const handleRemoveQuestion = async questionId => {
        await modifyQuestionInModel(Action.REMOVE, questionId);
    };

    const fetchAvailableQuestions = async () => {
        await authenticatedReq(
            Endpoints.Questions.Base,
            'GET',
            null,
            auth.accessToken,
            (type, message) => {
                toast.error(`Failed to load available questions: ${message}`);
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
            },
            data => {
                setAvailable(
                    data.map(q => ({
                        id: q.id,
                        name: q.body || `Question ID: ${q.id}`,
                        validated: q.validated,
                        createdAt: q.createdAt,
                    }))
                );
            }
        );
    };

    const handleOpenAddQuestionDialog = async () => {
        setAddOpen(true);
        await fetchAvailableQuestions();
    };

    const handleAddQuestionToModel = async questionId => {
        // `addingQuestion` state is managed within `modifyQuestionInModel`
        await modifyQuestionInModel(Action.ADD, questionId);
        // Do NOT close the dialog: setAddOpen(false);
    };

    if (status === 'loading') return <Loading message="Loading test model details..." />;
    if (status === 'notfound' || !model) return <NotFound message="Test model not found." />;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 overflow-hidden">
                {/* First Column: Model Info and Config Form */}
                <div className="flex flex-col gap-6">
                    {/* Card 1: Test Model Details (with editable name) */}
                    <Card className="shadow-lg rounded-lg dark:bg-gray-800 border dark:border-gray-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Test Model Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                            <section className="flex items-start justify-between rounded-lg border dark:border-gray-700 bg-card dark:bg-gray-850 p-3 shadow-sm">
                                <div>
                                    <h4 className="font-medium text-gray-900 dark:text-gray-50">Name</h4>
                                    <p className="whitespace-pre-wrap">{model.name}</p>
                                </div>
                                <Dialog open={isEditNameOpen} onOpenChange={setIsEditNameOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm" className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                                            <Edit size={16} />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="dark:bg-gray-800">
                                        <DialogHeader>
                                            <DialogTitle className="dark:text-gray-50">Edit Model Name</DialogTitle>
                                            <DialogDescription className="dark:text-gray-400">
                                                Change the name for this test model.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Input
                                            value={draftModelName}
                                            onChange={e => setDraftModelName(e.target.value)}
                                            className="my-4 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                            placeholder="Enter model name"
                                        />
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setIsEditNameOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancel</Button>
                                            <Button onClick={handleSaveModelName} className="dark:bg-blue-600 dark:hover:bg-blue-700">Save Name</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </section>

                            <section className={'rounded-lg border dark:border-gray-700 bg-card dark:bg-gray-850 p-3 shadow-sm'}>
                                <h4 className="font-medium text-gray-900 dark:text-gray-50">ID</h4>
                                <p>{model.id}</p>
                            </section>
                            <section className={'rounded-lg border dark:border-gray-700 bg-card dark:bg-gray-850 p-3 shadow-sm'}>
                                <h4 className="font-medium text-gray-900 dark:text-gray-50">Created</h4>
                                <p>{new Date(model.createdAt).toLocaleString()}</p>
                            </section>
                            <section className={'rounded-lg border dark:border-gray-700 bg-card dark:bg-gray-850 p-3 shadow-sm'}>
                                <h4 className="font-medium text-gray-900 dark:text-gray-50">Total Questions</h4>
                                <p>{model.questions.length}</p>
                            </section>
                        </CardContent>
                    </Card>

                    {/* Card 2: Test Configuration Form */}
                    <Card className="shadow-lg rounded-lg dark:bg-gray-800 border dark:border-gray-700">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Test Configuration</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-gray-700 dark:text-gray-300">
                            <div>
                                <Label htmlFor="expiresAfter" className="font-medium text-gray-900 dark:text-gray-50">Expires After (minutes, 0 or empty for no limit)</Label>
                                <Input
                                    id="expiresAfter"
                                    type="number"
                                    value={expiresAfter}
                                    onChange={e => setExpiresAfter(e.target.value)}
                                    placeholder="e.g., 60"
                                    className="mt-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                                    min="0"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="shuffleQuestions"
                                    checked={shuffleQuestions}
                                    onCheckedChange={setShuffleQuestions}
                                    className="dark:border-gray-600 data-[state=checked]:dark:bg-blue-600"
                                />
                                <Label htmlFor="shuffleQuestions" className="font-medium text-gray-900 dark:text-gray-50">Shuffle Questions</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="shuffleVariants"
                                    checked={shuffleVariants}
                                    onCheckedChange={setShuffleVariants}
                                    className="dark:border-gray-600 data-[state=checked]:dark:bg-blue-600"
                                />
                                <Label htmlFor="shuffleVariants" className="font-medium text-gray-900 dark:text-gray-50">Shuffle Variants</Label>
                            </div>
                            <Button onClick={handleSaveConfiguration} disabled={savingConfiguration} className="w-full mt-2 dark:bg-blue-600 dark:hover:bg-blue-700">
                                {savingConfiguration ? 'Saving...' : 'Save Configuration'}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Second Column: Questions List (as before, with minor style adjustments if needed) */}
                <Card className="flex flex-col flex-1 shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 border dark:border-gray-700">
                    <CardHeader className="pb-4 border-b dark:border-gray-700">
                        <CardTitle className="text-xl font-semibold text-gray-800 dark:text-gray-100">Questions in Model</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 p-0 overflow-hidden">
                        <div className="flex-grow overflow-y-auto p-4 md:p-6">
                            {model.questions.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400 py-10">
                                    <FileQuestion className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4" strokeWidth={1.5} />
                                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">No Questions Yet</h3>
                                    <p className="mt-1 text-sm">This model doesn't have any questions. Add some to get started!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-4"> {/* Adjusted grid for better fit */}
                                    {model.questions.map(q => (
                                        <Card
                                            key={q.id}
                                            className="flex flex-col cursor-pointer hover:shadow-xl dark:bg-gray-850 dark:hover:bg-gray-700 transition-shadow duration-200 rounded-md border dark:border-gray-700"
                                            onClick={() => navigate(`/questions/${q.id}`)}
                                        >
                                            <CardHeader className="p-3 space-y-1.5">
                                                <div className="flex justify-between items-start gap-2">
                                                    <span className="font-semibold text-sm text-gray-800 dark:text-gray-100 break-words leading-tight flex-grow">
                                                        {q.body || q.name || `Question ID: ${q.id}`}
                                                    </span>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="w-7 h-7 flex-shrink-0 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500"
                                                        onClick={e => {
                                                            e.stopPropagation();
                                                            handleRemoveQuestion(q.id);
                                                        }}
                                                        aria-label="Remove question"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex items-center justify-between text-xs">
                                                    {q.validated ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 rounded-full font-medium">
                                                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Validated
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 rounded-full font-medium">
                                                            <XCircle className="w-3.5 h-3.5 mr-1" /> Not Validated
                                                        </span>
                                                    )}
                                                    <span className="text-gray-500 dark:text-gray-400">
                                                        {new Date(q.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="mt-auto p-4 md:p-6 border-t dark:border-gray-700">
                            <Button variant="outline" onClick={handleOpenAddQuestionDialog} className="w-full dark:text-gray-100 dark:border-gray-600 dark:hover:bg-gray-700">
                                <Plus className="mr-2 h-4 w-4" /> Add Question from Library
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>

            {/* Add Question Dialog (modified behavior) */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent className="max-w-lg w-[95vw] sm:w-[90vw] bg-white dark:bg-gray-800 rounded-lg">
                    <DialogHeader className="pb-3">
                        <DialogTitle className="text-lg font-medium text-gray-900 dark:text-gray-50">Add Question to Model</DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 dark:text-gray-400">
                            Select questions to add. The list will update after each addition.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Search available questions..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mb-4 mt-1 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                    />
                    <div className="h-72 border dark:border-gray-700 rounded-md overflow-y-auto">
                        {filteredAvailableQuestions.length > 0 ? (
                            <ul className="space-y-1 p-2">
                                {filteredAvailableQuestions.map(q => (
                                    <li
                                        key={q.id}
                                        className="flex justify-between items-center p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                    >
                                        <div className="flex items-center space-x-2 overflow-hidden">
                                            <span className="text-sm text-gray-800 dark:text-gray-100 truncate" title={q.name}>{q.name}</span>
                                            {q.validated ? (
                                                <span className="flex-shrink-0 px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 rounded-full text-xs inline-flex items-center">
                                                    <CheckCircle className="w-3 h-3 mr-0.5" /> Valid
                                                </span>
                                            ) : (
                                                <span className="flex-shrink-0 px-1.5 py-0.5 bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100 rounded-full text-xs inline-flex items-center">
                                                    <XCircle className="w-3 h-3 mr-0.5" /> Not Valid
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAddQuestionToModel(q.id)}
                                            disabled={addingQuestion}
                                            className="ml-2 flex-shrink-0 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                                        >
                                            {addingQuestion ? <Loading className="h-4 w-4" /> :<Plus className="h-4 w-4" />}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-500 dark:text-gray-400">
                                <FileQuestion className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" strokeWidth={1.5}/>
                                <p className="text-sm font-medium">No Matching Questions Found</p>
                                <p className="text-xs mt-1">
                                    {search ? "Try a different search term." : "All available questions might already be in the model, or there are no questions in the library."}
                                </p>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="mt-5">
                        <Button variant="outline" onClick={() => setAddOpen(false)} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                            Done Adding
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Actual Test Dialog (as before) */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="bg-white dark:bg-gray-800 rounded-lg">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 dark:text-gray-50">Create Actual Test</DialogTitle>
                        <DialogDescription className="text-gray-500 dark:text-gray-400">
                            (This feature is coming soon — configure your test parameters here.)
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 text-sm text-gray-600 dark:text-gray-300">
                        Test configuration options will appear here.
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)} className="dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
