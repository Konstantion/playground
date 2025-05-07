import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card.js';
import {Button} from '@/components/ui/button.js';
import {CheckCircle} from 'lucide-react';
import {toast} from 'sonner';
import {useAuth} from '@/hooks/useAuth.jsx';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {ErrorType} from '@/utils/ErrorType.js';
import {Routes as RRoutes} from '@/rout/Routes.jsx';

const intervalMs = 2000;

export default function ValidateCard({ question, setQuestion }) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState(null);
    const [isValidating, setIsValidating] = useState(false);
    const [validated, setValidated] = useState(question.validated);
    const intervalRef = useRef(null);

    useEffect(() => {
        setValidated(question.validated);
        if (question.validated && intervalRef.current) {
            clearInterval(intervalRef.current);
            setIsValidating(false);
        }
    }, [question.validated]);

    const fetchStatus = useCallback(
        async silent => {
            await authenticatedReq(
                `${Endpoints.Questions.Base}/${question.id}/status`,
                'GET',
                null,
                auth.accessToken,
                (type, message) => {
                    toast.error(message);
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                    clearInterval(intervalRef.current);
                    setIsValidating(false);
                },
                response => {
                    setStatus(response.status);

                    if (response.status === 'Success') {
                        clearInterval(intervalRef.current);
                        setValidated(true);
                        setIsValidating(false);
                        setQuestion({ ...question, validated: true });
                        toast.success('Validation succeeded');
                    } else if (response.status.startsWith('Error')) {
                        clearInterval(intervalRef.current);
                        setIsValidating(false);
                        if (!silent) {
                            toast.error(response.status);
                        }
                    }
                }
            );
        },
        [question, auth.accessToken, logout, navigate, setQuestion]
    );

    const handleValidate = async () => {
        setIsValidating(true);
        setStatus(null);
        if (intervalRef.current) clearInterval(intervalRef.current);

        await authenticatedReq(
            `${Endpoints.Questions.Base}/${question.id}/validate`,
            'PUT',
            null,
            auth.accessToken,
            (type, message) => {
                toast.error(message);
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
                clearInterval(intervalRef.current);
                setIsValidating(false);
                fetchStatus(true);
            },
            taskId => {
                fetchStatus(false);
                intervalRef.current = setInterval(() => fetchStatus(false), intervalMs);
            }
        );
    };

    useEffect(() => () => intervalRef.current && clearInterval(intervalRef.current), []);

    return (
        <Card className="flex flex-col rounded-lg border bg-card p-4 shadow-sm">
            <CardHeader>
                <CardTitle>Validate Question</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center items-center space-y-4">
                {validated ? (
                    <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle />
                        <span className="font-semibold">Already Validated</span>
                    </div>
                ) : (
                    <>
                        <section className="text-center w-full">
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <div className="w-full h-full p-4 border rounded bg-gray-50 overflow-auto">
                                {' '}
                                {status ? (
                                    <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                        {status}
                                    </pre>
                                ) : (
                                    <span className="text-sm text-gray-400">Not started</span>
                                )}
                            </div>
                        </section>
                        <Button onClick={handleValidate} disabled={isValidating} className="w-full">
                            {isValidating ? 'Validating...' : 'Validate'}
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
