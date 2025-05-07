import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { ErrorType } from '@/utils/ErrorType.js';
import { toast } from 'sonner';
import { Action, actionStr } from '@/entities/Action.js';
import { CheckCircle, Trash2, Plus, XCircle } from 'lucide-react';
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
    const [addOpen, setAddOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (!id) {
            setStatus('notfound');
            return;
        }
        (async () => {
            setStatus('loading');
            await authenticatedReq(
                `${Endpoints.TestModel.Base}/${id}`,
                'GET',
                null,
                auth.accessToken,
                (type, msg) => {
                    setStatus('notfound');
                    toast.error(msg);
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RLogin);
                    }
                },
                data => {
                    setModel(data);
                    setStatus('loaded');
                }
            );
        })();
    }, [id]);

    const filtered = useMemo(() => {
        if (!model) return [];
        const existing = new Set(model.questions.map(q => q.id));
        return available.filter(
            q => !existing.has(q.id) && q.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [available, model, search]);

    const modifyQ = async (action, qid) => {
        const patchBody = { action: actionStr(action), questionId: qid };
        await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (t, m) => {
                toast.error(m);
                if (t === ErrorType.TokenExpired) {
                    logout();
                    navigate(RLogin);
                }
            },
            updatedModel => {
                setModel(updatedModel);
            }
        );
    };

    const removeQ = async qid => modifyQ(Action.REMOVE, qid);

    const openAdd = async () => {
        setAddOpen(true);
        await authenticatedReq(
            Endpoints.Questions.Base,
            'GET',
            null,
            auth.accessToken,
            (t, m) => toast.error(m),
            data =>
                setAvailable(
                    data.map(q => ({
                        id: q.id,
                        name: q.body,
                        validated: q.validated,
                        createdAt: q.createdAt,
                    }))
                )
        );
    };

    const addQ = async qid => {
        setAdding(true);
        await modifyQ(Action.ADD, qid);
        setAdding(false);
    };

    if (status === 'loading') return <Loading />;
    if (status === 'notfound' || !model) return <NotFound />;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <div className="p-4 grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 flex-1 overflow-hidden">
                {/* Left: Model Info only */}
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>Test Model Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>
                            <strong>Name:</strong> {model.name}
                        </p>
                        <p>
                            <strong>ID:</strong> {model.id}
                        </p>
                        <p>
                            <strong>Created:</strong> {new Date(model.createdAt).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>

                {/* Right: Questions List */}
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Questions in Model</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 overflow-hidden relative">
                        <ScrollArea className="flex-1">
                            {model.questions.length === 0 ? (
                                <p className="text-sm text-gray-500 p-4">No questions added yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                    {model.questions.map(q => (
                                        <Card
                                            key={q.id}
                                            className="relative group hover:bg-gray-50 cursor-pointer"
                                            onClick={() => navigate(`/questions/${q.id}`)}
                                        >
                                            <CardHeader className="flex justify-between items-center">
                                                <span className="font-medium text-sm">
                                                    {q.body || q.name}
                                                </span>
                                                {q.validated ? (
                                                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
                                                        Validated
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs">
                                                        Not Validated
                                                    </span>
                                                )}
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-muted-foreground text-sm">
                                                    Created:{' '}
                                                    {new Date(q.createdAt).toLocaleString()}
                                                </p>
                                            </CardContent>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    removeQ(q.id);
                                                }}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                        {/* Add Question Button glued to bottom */}
                        <div className="border-t p-4 bg-white sticky bottom-0">
                            <Button
                                width="full"
                                variant="outline"
                                onClick={openAdd}
                                leftIcon={<Plus />}
                            >
                                Add Question
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Add Question Dialog */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild>
                    <div />
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add a Question</DialogTitle>
                        <DialogDescription>Choose from existing questions</DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="Search…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="mb-4"
                    />
                    <ScrollArea className="h-60">
                        <ul className="space-y-2">
                            {filtered.map(q => (
                                <li
                                    key={q.id}
                                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                                >
                                    <div className="flex items-center space-x-2">
                                        <span>{q.name}</span>
                                        {q.validated ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs inline-flex items-center">
                                                <CheckCircle className="w-4 h-4" />
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs inline-flex items-center">
                                                <XCircle className="w-4 h-4" />
                                            </span>
                                        )}
                                    </div>
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        onClick={() => addQ(q.id)}
                                        disabled={adding}
                                    >
                                        <Plus />
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </ScrollArea>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setAddOpen(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Test Dialog */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                    <div />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Actual Test</DialogTitle>
                        <DialogDescription>
                            (Coming soon — configure your test here)
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
