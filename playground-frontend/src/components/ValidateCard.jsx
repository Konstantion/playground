import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { AlertTriangle, CheckCircle, Info, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth.jsx';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { ErrorType } from '@/utils/ErrorType.js';
import { Routes as RRoutes } from '@/rout/Routes.jsx';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label.js';

const intervalMs = 2500;

export default function ValidateCard({
    question: initialQuestion,
    setQuestion: setParentQuestion,
    className,
    isEditable,
}) {
    const [question, setQuestion] = useState(initialQuestion);
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validated, setValidated] = useState(question.validated);
    const intervalRef = useRef(null);

    useEffect(() => {
        setQuestion(initialQuestion);
        const isNowValidated = initialQuestion.validated;
        setValidated(isNowValidated);

        if (isNowValidated) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setIsValidating(false);
            setStatus('Success');
        } else if (!isValidating) {
            if (!status) {
                setStatus(null);
            } else if (status === 'Success') {
                setStatus('NotRegistered');
            }
        }
    }, [initialQuestion, isValidating]);

    const fetchStatus = useCallback(
        async (silent = false) => {
            if (!question || !question.id) {
                if (!silent)
                    toast.error('Question ID is missing. Cannot fetch status.', { duration: 3000 });
                setIsValidating(false);
                if (intervalRef.current) clearInterval(intervalRef.current);
                return;
            }

            await authenticatedReq(
                `${Endpoints.Questions.Base}/${question.id}/status`,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    if (!silent)
                        toast.error(
                            `Status fetch error: ${message || 'Unknown error'} (Type: ${type})`,
                            { duration: 4000 }
                        );
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        if (navigate) navigate(RRoutes.Login.path);
                    }

                    clearInterval(intervalRef.current);
                    setIsValidating(false);
                    if (!status || !status.startsWith('Error:')) {
                        setStatus(`Error: ${message || 'Failed to fetch status'}`);
                    }
                },
                response => {
                    setStatus(response.status);
                    if (response.status === 'Success') {
                        clearInterval(intervalRef.current);
                        setValidated(true);
                        setIsValidating(false);

                        const updatedQuestion = { ...question, validated: true };
                        setQuestion(updatedQuestion);
                        if (setParentQuestion) setParentQuestion(updatedQuestion);
                        if (!silent)
                            toast.success('Question validation succeeded!', { duration: 3000 });
                    } else if (response.status && response.status.startsWith('Error')) {
                        clearInterval(intervalRef.current);
                        setIsValidating(false);
                        if (!silent) {
                            toast.error(`Validation process error: ${response.status}`, {
                                duration: 5000,
                                closeButton: true,
                            });
                        }
                    }
                }
            );
        },
        [question, auth.accessToken, logout, navigate, setParentQuestion, status]
    );

    const handleValidate = async () => {
        if (!question || !question.id) {
            toast.error('Question ID is missing. Cannot start validation.', { duration: 3000 });
            return;
        }
        if (!isEditable) {
            toast.warning('Cannot validate an immutable question.', { duration: 3000 });
            return;
        }

        setIsValidating(true);
        setValidated(false);
        setStatus('Initiating validation...');
        if (intervalRef.current) clearInterval(intervalRef.current);

        toast.info('Validation process initiated. Polling for status...', {
            id: 'validation-initiated',
            duration: 2500,
        });

        await authenticatedReq(
            `${Endpoints.Questions.Base}/${question.id}/validate`,
            'PUT',
            null,
            auth.accessToken,
            (type, message) => {
                toast.error(
                    `Validation start error: ${message || 'Unknown error'} (Type: ${type})`,
                    { duration: 5000, closeButton: true }
                );
                if (type === ErrorType.TokenExpired) {
                    logout();
                    if (navigate) navigate(RRoutes.Login.path);
                }

                clearInterval(intervalRef.current);
                setIsValidating(false);
                setStatus(`Error: ${message || 'Failed to start validation'}`);
            },
            _taskId => {
                fetchStatus(false);

                intervalRef.current = setInterval(() => fetchStatus(true), intervalMs);
            }
        );
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const getStatusDisplayProperties = () => {
        if (validated) {
            return {
                icon: <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />,
                text: 'This question has been successfully validated.',
                bgClass:
                    'bg-green-50 dark:bg-green-900/20 border-green-500/30 dark:border-green-600/40',
                textClass: 'text-green-700 dark:text-green-300',
            };
        }

        if (status && status.startsWith('Error')) {
            return {
                icon: <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />,
                text: status,
                bgClass: 'bg-red-50 dark:bg-red-900/20 border-red-500/30 dark:border-red-600/40',
                textClass: 'text-red-700 dark:text-red-300',
            };
        }
        if (isValidating || (status && status !== 'NotRegistered' && status !== null)) {
            return {
                icon: <Loader2 className="w-5 h-5 text-sky-500 dark:text-sky-400 animate-spin" />,
                text: status || 'Processing validation...',
                bgClass: 'bg-sky-50 dark:bg-sky-900/20 border-sky-500/30 dark:border-sky-600/40',
                textClass: 'text-sky-700 dark:text-sky-300',
            };
        }

        return {
            icon: <Info className="w-5 h-5 text-slate-500 dark:text-slate-400" />,
            text: 'This question has not been validated yet. Click the button below to start.',
            bgClass:
                'bg-slate-50 dark:bg-slate-700/20 border-slate-500/30 dark:border-slate-600/40',
            textClass: 'text-slate-700 dark:text-slate-300',
        };
    };

    const statusDisplay = getStatusDisplayProperties();

    return (
        <Card
            className={cn(
                'shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col',
                className
            )}
        >
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <div className="flex items-center">
                    <ShieldCheck size={20} className="mr-2.5 text-sky-600 dark:text-sky-500" />
                    <div>
                        <CardTitle className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Question Validation
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Ensure the question and its variants are correctly set up.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-4">
                <div className="space-y-1.5">
                    <Label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Current Status:
                    </Label>
                    <div
                        className={`w-full min-h-[60px] p-3 border rounded-lg flex items-start text-xs sm:text-sm transition-all duration-300 ease-in-out ${statusDisplay.bgClass}`}
                    >
                        <div className="flex items-center space-x-2.5">
                            <span className="flex-shrink-0 mt-0.5">{statusDisplay.icon}</span>
                            <pre
                                className={`whitespace-pre-wrap break-all min-w-0 font-sans leading-relaxed ${statusDisplay.textClass}`}
                            >
                                {statusDisplay.text}
                            </pre>{' '}
                        </div>
                    </div>
                </div>

                {!validated && (
                    <>
                        <Button
                            onClick={handleValidate}
                            disabled={isValidating || !isEditable}
                            className="w-full py-2.5 text-sm font-medium flex items-center justify-center space-x-2 rounded-lg
                                       bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-slate-800
                                       disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
                            title={!isEditable ? 'Cannot validate an immutable question' : ''}
                        >
                            {isValidating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Validating...</span>
                                </>
                            ) : (
                                <span>Start Validation</span>
                            )}
                        </Button>

                        {!isEditable && (
                            <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-2">
                                Validation is disabled for immutable questions.
                            </p>
                        )}
                    </>
                )}

                {validated && (
                    <div className="text-center text-sm text-green-700 dark:text-green-300 font-medium pt-2">
                        Question is validated.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
