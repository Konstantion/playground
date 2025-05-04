import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Header from '@/components/Header.jsx';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';

import { useAuth } from '@/hooks/useAuth.jsx';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { RHome, Routes } from '@/rout/Routes.jsx';
import { Card, CardHeader } from '@/components/ui/card.js';
import QuestionPreview from '@/components/QuestionPreview.jsx';
import PlaceholderConfigurator from '@/components/PlaceholderConfigurator.jsx';
import CallArgsConfigurator from '@/components/CallArgsConfigurator.jsx';
import AddVariant from '@/components/AddVariant.jsx';

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
        console.log('Question ', question);
    }, [question]);

    useEffect(() => {
        if (!id) {
            setStatus(State.NotFound);
            return;
        }

        const fetchQuestion = async () => {
            setStatus(State.Loading);
            await authenticatedReq(
                `${Endpoints.Questions.Base}/${id}`,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    setStatus(State.NotFound);
                    toast.error(message, { closeButton: true });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(Routes.Login.path);
                    }
                },
                question => {
                    console.log(question);
                    setQuestion(question);
                    setStatus(State.Loaded);
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
                <div className="grid grid-cols-[2fr_2fr_3fr_3fr] grid-rows-2 gap-4 w-full h-screen p-4">
                    <QuestionPreview className="col-span-2" question={question} />

                    <Card>
                        <CardHeader>Correct Variants</CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>Incorrect Variants</CardHeader>
                    </Card>

                    <PlaceholderConfigurator
                        id={id}
                        question={question}
                        setQuestion={setQuestion}
                    />

                    <CallArgsConfigurator id={id} question={question} setQuestion={setQuestion} />

                    <AddVariant language={question.lang} question={question} onChange={console.log} />

                    <Card>
                        <CardHeader>Validate</CardHeader>
                    </Card>
                </div>
            )}
        </div>
    );
}
