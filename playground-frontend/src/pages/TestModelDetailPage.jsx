import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import {Input} from '@/components/ui/input';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {useAuth} from '@/hooks/useAuth.jsx';
import {ErrorType} from '@/utils/ErrorType.js';
import {toast} from 'sonner';
import {Plus, Trash2} from 'lucide-react';
import Loading from "@/components/Loading.jsx";
import NotFound from "@/components/NotFound.jsx";
import Header from "@/components/Header.jsx";
import {RHome} from "@/rout/Routes.jsx";

/**
 * Page for viewing and editing a single TestModel
 */
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
                    if (type === ErrorType.TokenExpired) logout();
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

    const removeQ = async qid => {
        await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}/questions/${qid}`,
            'DELETE',
            null,
            auth.accessToken,
            (t, m) => toast.error(m),
            () => {
                setModel(m => ({
                    ...m,
                    questions: m.questions.filter(q => q.id !== qid),
                }));
                toast.success('Removed');
            }
        );
    };

    const openAdd = async () => {
        setAddOpen(true);
        await authenticatedReq(
            Endpoints.Questions.GetAll,
            'GET',
            null,
            auth.accessToken,
            (t, m) => toast.error(m),
            data => setAvailable(data.map(q => ({ id: q.id, name: q.body })))
        );
    };

    const addQ = async qid => {
        setAdding(true);
        await authenticatedReq(
            `${Endpoints.TestModel.Base}/${id}/questions/${qid}`,
            'POST',
            null,
            auth.accessToken,
            (t, m) => toast.error(m),
            newQ => {
                setModel(m => ({ ...m, questions: [...m.questions, newQ] }));
                setAddOpen(false);
                toast.success('Added');
            }
        );
        setAdding(false);
    };

    if (status === 'loading') return <Loading />;
    if (status === 'notfound' || !model) return <NotFound />;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header page={null} setPage={p => navigate(`${RHome}/${p}`)} />

            <div className="p-4 grid grid-cols-[2fr_3fr] gap-6 flex-1 overflow-hidden">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>{`Test Model #${model.id}`}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <p><strong>Name:</strong> {model.name}</p>
                            <p><strong>Created:</strong> {new Date(model.createdAt).toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                            <Button variant="outline" onClick={openAdd} leftIcon={<Plus />}>
                                Add Question
                            </Button>
                            <Button onClick={() => setCreateOpen(true)}>
                                Create Actual Test
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Questions in Model</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 overflow-hidden">
                        {model.questions.length === 0 ? (
                            <p className="text-sm text-gray-500">No questions added yet.</p>
                        ) : (
                            <ScrollArea className="flex-1">
                                <ul className="space-y-2">
                                    {model.questions.map(q => (
                                        <li
                                            key={q.id}
                                            className="p-3 bg-white rounded shadow flex justify-between items-center"
                                        >
                                            <span
                                                className="text-blue-600 hover:underline cursor-pointer"
                                                onClick={() => navigate(`/questions/${q.id}`)}
                                            >
                                                {q.body || q.name}
                                            </span>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() => removeQ(q.id)}
                                            >
                                                <Trash2 />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogTrigger asChild><div /></DialogTrigger>
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
                                    <span>{q.name}</span>
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

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild><div /></DialogTrigger>
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
