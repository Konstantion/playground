import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import NotFound from '@/components/NotFound';
import Loading from '@/components/Loading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header.jsx';
import { RHome, Routes as RRoutes } from '@/rout/Routes.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';

const State = Object.freeze({
    Loading: 'Loading',
    NotFound: 'NotFound',
    Loaded: 'Loaded',
});

export default function QuestionDetailPage() {
    const { id } = useParams();
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState(State.Loading);
    const [question, setQuestion] = useState(null);

    useEffect(() => {
        if (!id) {
            setStatus(State.NotFound);
            return;
        }

        const fetchQuestion = async () => {
            setStatus(State.Loading);
            await authenticatedReq(
                Endpoints.Questions.Base + `/${id}`,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setStatus(State.NotFound);
                    toast.error(message, { closeButton: true });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                question => {
                    console.log(question);
                    setStatus(State.Loaded);
                    setQuestion(question);
                }
            );
        };

        fetchQuestion();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Header page={null} setPage={page => navigate(`${RHome}/${page}`)} />

            {status === State.Loading && <Loading />}

            {status === State.NotFound && <NotFound />}

            {status === State.Loaded && question && (
                <div className="p-4 flex justify-center">
                    <Card className="w-full max-w-3xl h-[600px] flex flex-col">
                        {' '}
                        <CardHeader>
                            <CardTitle>Question #{question.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto space-y-4 p-6">
                            <section>
                                <h4 className="font-medium">Language</h4>
                                <p>{question.lang}</p>
                            </section>

                            <section>
                                <h4 className="font-medium">Body</h4>
                                <p className="whitespace-pre-wrap">{question.body}</p>
                            </section>

                            <section>
                                <h4 className="font-medium">Code & Format</h4>
                                <ScrollArea className="h-40 border rounded p-2 bg-gray-50">
                                    <pre className="whitespace-pre-wrap text-sm">
                                        {JSON.stringify(question.formatAndCode, null, 2)}
                                    </pre>
                                </ScrollArea>
                            </section>

                            <section>
                                <h4 className="font-medium">Placeholders</h4>
                                <ul className="list-disc pl-5">
                                    {Object.entries(question.placeholderDefinitions).map(
                                        ([key, val]) => (
                                            <li key={key}>
                                                <code>{key}</code>: {val}
                                            </li>
                                        )
                                    )}
                                </ul>
                            </section>

                            <section>
                                <h4 className="font-medium">Call Args</h4>
                                <ul className="list-decimal pl-5">
                                    {question.callArgs.map((arg, i) => (
                                        <li key={i}>{arg}</li>
                                    ))}
                                </ul>
                            </section>

                            {question.additionalCheck && (
                                <section>
                                    <h4 className="font-medium">Additional Check</h4>
                                    <pre className="whitespace-pre-wrap text-sm border rounded p-2 bg-gray-50">
                                        {question.additionalCheck.code}
                                    </pre>
                                </section>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <section>
                                    <h4 className="font-medium">Correct Variants</h4>
                                    <ul className="list-disc pl-5">
                                        {question.correctVariants.map(v => (
                                            <li key={v.id}>
                                                <pre className="whitespace-pre-wrap text-sm bg-green-50 p-2 rounded">
                                                    {v.code.code}
                                                </pre>
                                            </li>
                                        ))}
                                    </ul>
                                </section>

                                <section>
                                    <h4 className="font-medium">Incorrect Variants</h4>
                                    <ul className="list-disc pl-5">
                                        {question.incorrectVariants.map(v => (
                                            <li key={v.id}>
                                                <pre className="whitespace-pre-wrap text-sm bg-red-50 p-2 rounded">
                                                    {v.code.code}
                                                </pre>
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            </div>

                            <div className="flex gap-4">
                                <p>
                                    <strong>Validated:</strong> {question.validated ? 'Yes' : 'No'}
                                </p>
                                <p>
                                    <strong>Public:</strong> {question.public ? 'Yes' : 'No'}
                                </p>
                            </div>

                            <p className="text-sm text-gray-500">
                                Created at: {new Date(question.createdAt).toLocaleString()}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
