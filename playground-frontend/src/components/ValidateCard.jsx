import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Button } from '@/components/ui/button.js';
import { AlertTriangle, CheckCircle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth.jsx';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { ErrorType } from '@/utils/ErrorType.js';
import { Routes as RRoutes } from '@/rout/Routes.jsx';

const intervalMs = 2000;

export default function ValidateCard({
    question: initialQuestion,
    setQuestion: setParentQuestion,
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
        setValidated(initialQuestion.validated);
        if (initialQuestion.validated) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setIsValidating(false);
            setStatus('Success');
        }
    }, [initialQuestion]);

    const fetchStatus = useCallback(
        async (silent = false) => {
            if (!question || !question.id) {
                if (!silent) toast.error('Question ID is missing. Cannot fetch status.');
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
                    if (!silent) toast.error(`Status fetch error: ${message} (Type: ${type})`);
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        if (navigate) navigate(RRoutes.Login.path);
                    }
                    clearInterval(intervalRef.current);
                    setIsValidating(false);
                    if (!status || !status.startsWith('Error:')) {
                        setStatus(`Error: ${message}`);
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
                        if (!silent) toast.success('Validation succeeded!');
                    } else if (response.status && response.status.startsWith('Error')) {
                        clearInterval(intervalRef.current);
                        setIsValidating(false);
                        if (!silent) {
                            toast.error(`Validation error: ${response.status}`);
                        }
                    }
                }
            );
        },
        [question, auth.accessToken, logout, navigate, setParentQuestion, status]
    );

    const handleValidate = async () => {
        if (!question || !question.id) {
            toast.error('Question ID is missing. Cannot start validation.');
            return;
        }

        setIsValidating(true);
        setStatus('Initiating validation...');
        if (intervalRef.current) clearInterval(intervalRef.current);

        await authenticatedReq(
            `${Endpoints.Questions.Base}/${question.id}/validate`,
            'PUT',
            null,
            auth.accessToken,
            (type, message) => {
                toast.error(`Validation start error: ${message} (Type: ${type})`);
                if (type === ErrorType.TokenExpired) {
                    logout();
                    if (navigate) navigate(RRoutes.Login.path);
                }
                clearInterval(intervalRef.current);
                setIsValidating(false);
                setStatus(`Error: ${message}`);
            },
            _taskId => {
                fetchStatus(false);
                intervalRef.current = setInterval(() => fetchStatus(false), intervalMs);
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
        if (validated || status === 'Success') {
            return {
                icon: <CheckCircle className="w-5 h-5 text-green-500" />,
                text: validated ? 'This question has been successfully validated.' : status,
                bgClass: 'bg-green-50 dark:bg-green-900/30',
                textClass: 'text-green-700 dark:text-green-400',
                borderClass: 'border-green-500/50',
            };
        }
        if (status && status.startsWith('Error')) {
            return {
                icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
                text: status,
                bgClass: 'bg-red-50 dark:bg-red-900/30',
                textClass: 'text-red-700 dark:text-red-400',
                borderClass: 'border-red-500/50',
            };
        }
        if (isValidating || (status && status !== 'Not started' && status !== null)) {
            return {
                icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
                text: status || 'Processing validation...',
                bgClass: 'bg-blue-50 dark:bg-blue-900/30',
                textClass: 'text-blue-700 dark:text-blue-400',
                borderClass: 'border-blue-500/50',
            };
        }
        return {
            icon: <Info className="w-5 h-5 text-gray-500" />,
            text: 'This question has not been validated yet. Click the button below to start.',
            bgClass: 'bg-gray-50 dark:bg-gray-700/30',
            textClass: 'text-gray-700 dark:text-gray-400',
            borderClass: 'border-gray-500/30',
        };
    };

    const statusDisplay = getStatusDisplayProperties();

    return (
        <Card className="w-full max-w-lg mx-auto shadow-xl rounded-xl overflow-hidden dark:bg-gray-800">
            <CardHeader className="bg-gray-50 dark:bg-gray-700/50 p-6 border-b dark:border-gray-700">
                <CardTitle className="text-center text-2xl font-semibold text-gray-800 dark:text-gray-100">
                    Question Validation
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
                {validated ? (
                    <div className="flex flex-col items-center space-y-4 text-center p-6 bg-green-50 dark:bg-green-900/30 rounded-lg border border-green-500/50">
                        <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400" />
                        <h3 className="text-xl font-semibold text-green-700 dark:text-green-300">
                            Successfully Validated
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            This question meets all validation criteria.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                                Current Status:
                            </label>
                            <div
                                className={`w-full min-h-[70px] p-4 border rounded-lg flex items-start text-sm transition-all duration-300 ease-in-out
                                            ${statusDisplay.bgClass} ${statusDisplay.borderClass}`}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="flex-shrink-0 mt-0.5">
                                        {statusDisplay.icon}
                                    </span>
                                    <pre
                                        className={`whitespace-pre-wrap font-sans ${statusDisplay.textClass}`}
                                    >
                                        {statusDisplay.text}
                                    </pre>
                                </div>
                            </div>
                        </div>

                        <Button
                            onClick={handleValidate}
                            disabled={isValidating || validated}
                            className="w-full py-3 text-base font-medium flex items-center justify-center space-x-2 rounded-lg
                                       transition-all duration-200 ease-in-out
                                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800
                                       disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {isValidating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Validating... Please Wait</span>
                                </>
                            ) : (
                                <span>Start Validation Process</span>
                            )}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
