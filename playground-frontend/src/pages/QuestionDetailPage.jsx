import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert'; // Import Alert components
import {Lock} from 'lucide-react'; // Import Lock icon
// ... other imports ...
import Header from '@/components/Header.jsx';
import Loading from '@/components/Loading.jsx';
import NotFound from '@/components/NotFound.jsx';
import {useAuth} from '@/hooks/useAuth.jsx';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {toast} from 'sonner';
import {ErrorType} from '@/utils/ErrorType.js';
import {RHome, Routes} from '@/rout/Routes.jsx';
import QuestionPreview from '@/components/QuestionPreview.jsx';
import PlaceholderConfigurator from '@/components/PlaceholderConfigurator.jsx';
import CallArgsConfigurator from '@/components/CallArgsConfigurator.jsx';
import AddVariant from '@/components/AddVariant.jsx';
import {VariantsCarousel} from '@/components/VariantsCarousel.jsx';
import ValidateCard from '@/components/ValidateCard.jsx';
import {Card} from '@/components/ui/card.js';

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
        // ... (fetchQuestion logic remains the same) ...
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
                    toast.error(message || 'Failed to load question details.', {
                        closeButton: true,
                        duration: 5000,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(Routes.Login.path);
                    }
                },
                fetchedQuestion => {
                    setQuestion(fetchedQuestion);
                    setStatus(State.Loaded);
                    document.title = `${fetchedQuestion.body || 'Question Detail'} - Playground`;
                }
            );
        };

        fetchQuestion();
    }, [id, auth.accessToken, logout, navigate]);

    // ... (loading and not found states remain the same) ...
    if (status === State.Loading) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={page => navigate(`${RHome}/${page}`)} />
                <Loading message="Loading question details..." />
            </div>
        );
    }

    if (status === State.NotFound || !question) {
        return (
            <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col">
                <Header page={null} setPage={page => navigate(`${RHome}/${page}`)} />
                <NotFound message="The question you are looking for could not be found." />
            </div>
        );
    }

    // Determine if the question is editable based on the 'public' flag
    const isEditable = question.public;

    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
            <Header page={null} setPage={page => navigate(`${RHome}/${page}`)} />

            {/* Main content grid */}
            <main className="flex-1 p-4 md:p-6 lg:p-8">
                {/* Add Immutable Indicator Banner */}
                {!isEditable && (
                    <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300">
                        <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        <AlertTitle className="font-semibold">Read-Only Mode</AlertTitle>
                        <AlertDescription className="text-sm">
                            This question is part of an immutable test snapshot and cannot be
                            edited.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
                    {/* Column 1: Question Preview & Placeholder Configurator */}
                    <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-6 xl:gap-8">
                        <QuestionPreview
                            question={question}
                            setQuestion={setQuestion}
                            isEditable={isEditable} // Pass down editable status
                        />
                        <PlaceholderConfigurator
                            id={id}
                            question={question}
                            setQuestion={setQuestion}
                            isEditable={isEditable} // Pass down editable status
                        />
                    </div>

                    {/* Column 2: Variants Carousels & Call Args */}
                    <div className="lg:col-span-7 xl:col-span-5 flex flex-col gap-6 xl:gap-8">
                        <VariantsCarousel
                            language={question.lang}
                            variants={question.correctVariants}
                            title={'Correct Variants'}
                            question={question}
                            setQuestion={setQuestion}
                            correct={true}
                            className="min-h-[300px] md:min-h-[350px]"
                            isEditable={isEditable} // Pass down editable status
                        />
                        <VariantsCarousel
                            language={question.lang}
                            variants={question.incorrectVariants}
                            title={'Incorrect Variants'}
                            question={question}
                            setQuestion={setQuestion}
                            correct={false}
                            className="min-h-[300px] md:min-h-[350px]"
                            isEditable={isEditable} // Pass down editable status
                        />
                        <CallArgsConfigurator
                            id={id}
                            question={question}
                            setQuestion={setQuestion}
                            isEditable={isEditable} // Pass down editable status
                        />
                    </div>

                    {/* Column 3: Add Variant & Validate Card */}
                    <div className="lg:col-span-12 xl:col-span-3 flex flex-col gap-6 xl:gap-8">
                        {/* Conditionally render AddVariant */}
                        {isEditable ? (
                            <AddVariant question={question} setQuestion={setQuestion} />
                        ) : (
                            <Card className="shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col items-center justify-center p-6 min-h-[200px]">
                                <Lock className="h-8 w-8 text-slate-400 dark:text-slate-500 mb-3" />
                                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                                    Cannot add variants to an immutable question.
                                </p>
                            </Card>
                        )}
                        <ValidateCard
                            question={question}
                            setQuestion={setQuestion}
                            isEditable={isEditable} // Pass down editable status
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
