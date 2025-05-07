import React, { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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

export default function TestModelsPage() {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [modelName, setModelName] = useState('');
    const [models, setModels] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

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
                    toast.error(message, { closeButton: true });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                data => {
                    setModels(data.map(m => ({ id: m.id, name: m.name, createdAt: m.createdAt })));
                    setLoading(false);
                }
            );
        };
        fetchModels();
    }, []);

    const handleCreate = async () => {
        if (!between(modelName, 1, 50)) {
            toast.error('Name must be between 1 and 50 characters');
            return;
        }
        await authenticatedReq(
            Endpoints.TestModel.Base,
            'POST',
            { name: modelName },
            auth.accessToken,
            (type, message) => {
                toast.error(message, { closeButton: true });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            created => {
                toast.success('Test model created');
                setModelName('');
                setModels(prev => [
                    ...prev,
                    { id: created.id, name: created.name, createdAt: created.createdAt },
                ]);
            }
        );
    };

    const filtered = useMemo(
        () => models.filter(m => m.name.toLowerCase().includes(search.toLowerCase())),
        [models, search]
    );

    return (
        <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="border rounded-md p-4 space-y-4 lg:col-span-1">
                <h2 className="text-lg font-semibold mb-2">Create Test Model</h2>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="model-name" className="text-sm font-medium">
                            Name
                        </label>
                        <Input
                            id="model-name"
                            value={modelName}
                            onChange={e => setModelName(e.target.value)}
                            className="w-full"
                        />
                    </div>
                    <Button onClick={handleCreate} className="w-full">
                        Create
                    </Button>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                {loading ? (
                    <Loading />
                ) : (
                    <>
                        <Input
                            placeholder="Search by name..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full"
                        />
                        <ScrollArea className="h-[600px] w-full rounded-md border p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map(item => (
                                    <Card
                                        key={item.id}
                                        className="cursor-pointer"
                                        onClick={() => navigate(`${RTestModels}/${item.id}`)}
                                    >
                                        <CardHeader>
                                            <h3 className="text-sm font-medium">Name</h3>
                                            <p className="text-muted-foreground">{item.name}</p>
                                        </CardHeader>
                                        <CardContent className="space-y-1">
                                            <div>
                                                <p className="text-sm font-medium">Created At</p>
                                                <p className="text-muted-foreground">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </div>
        </div>
    );
}
