import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Editor } from '@monaco-editor/react';
import { Check, ChevronLeft, ChevronRight, Edit, Trash2, X } from 'lucide-react';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { Action, actionStr } from '@/entities/Action.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { Routes as RRoutes } from '@/rout/Routes.jsx';
import { sNotEmpty } from '@/utils/ObjectUtils.js';

export function VariantsCarousel({
    className,
    question,
    correct,
    title,
    variants,
    language,
    setQuestion,
}) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [draftCode, setDraftCode] = useState('');

    if (!variants || variants.length === 0) {
        return (
            <Card className={cn('h-full flex flex-col relative', className)}>
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
                <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
                    No variants
                </div>
            </Card>
        );
    }

    const goPrev = () => {
        setCurrentIndex(i => (i === 0 ? variants.length - 1 : i - 1));
        setEditingId(null);
    };

    const goNext = () => {
        setCurrentIndex(i => (i === variants.length - 1 ? 0 : i + 1));
        setEditingId(null);
    };

    const deleteVariant = async variantId => {
        const patchBody = {
            action: actionStr(Action.REMOVE),
        };

        if (correct) {
            patchBody.correctVariant = variantId;
        } else {
            patchBody.incorrectVariant = variantId;
        }

        let success = false;
        await authenticatedReq(
            Endpoints.Questions.Base + `/${question.id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(message, { closeButton: true, duration: 10_000 });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            response => {
                if (sNotEmpty(response?.updated)) {
                    success = true;
                    setQuestion(response.updated);
                    setCurrentIndex(prev => Math.max(prev - 1, 0));
                }

                if (sNotEmpty(response?.violations)) {
                    Object.entries(response.violations).forEach(([key, value]) => {
                        toast.error(
                            `Violation error for ${key}, ${value.join('and ').toLowerCase()}.`,
                            { closeButton: true }
                        );
                    });
                }
            }
        );

        if (success) {
            await authenticatedReq(
                Endpoints.Variant.Base + `/${variantId}`,
                'DELETE',
                null,
                auth.accessToken,
                (type, message) => {
                    toast.error(message, { closeButton: true, duration: 10_000 });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                response => {}
            );
        }
    };

    const updateVariant = async (variantId, code) => {
        const patchBody = {
            code: code,
        };

        await authenticatedReq(
            Endpoints.Variant.Base + `/${variantId}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(message, { closeButton: true, duration: 10_000 });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            response => {
                if (sNotEmpty(response)) {
                    const updated = [...variants];
                    const index = updated.findIndex(variant => variant.id === response.id);
                    if (index !== -1) {
                        updated[index] = response;

                        setQuestion(prev => {
                            const toReturn = { ...prev };
                            if (correct) {
                                toReturn.correctVariants = updated;
                            } else {
                                toReturn.incorrectVariants = updated;
                            }
                            return toReturn;
                        });
                    } else {
                        toast.error('Variant not found', { closeButton: true });
                    }
                } else {
                    toast.error('Failed to update variant', { closeButton: true });
                }
            }
        );

        setEditingId(null);
    };

    const current = variants[currentIndex];
    const isEditing = current.id === editingId;

    return (
        <Card className={cn('h-full flex flex-col relative', className)}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>

            <div className="flex-1 flex flex-col min-h-0">
                <div className="relative flex-1 min-h-0">
                    <div className="absolute inset-0 flex flex-col p-4">
                        <div className="flex-1 min-h-0">
                            <Editor
                                height="100%"
                                defaultLanguage={language}
                                value={isEditing ? draftCode : current.code.code}
                                onMount={editor => isEditing && editor.focus()}
                                onChange={val => isEditing && setDraftCode(val)}
                                options={{
                                    minimap: { enabled: false },
                                    scrollBeyondLastLine: false,
                                    readOnly: !isEditing,
                                }}
                            />
                        </div>

                        <div className="absolute top-4 right-4 flex space-x-2 z-10">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    setDraftCode(current.code.code);
                                    setEditingId(current.id);
                                }}
                            >
                                <Edit size={16} />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteVariant(current.id)}
                            >
                                <Trash2 size={16} />
                            </Button>
                        </div>

                        {isEditing && (
                            <div className="mt-2 flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setEditingId(null)}>
                                    <X className="inline mr-1" /> Cancel
                                </Button>
                                <Button
                                    onClick={() => {
                                        updateVariant(current.id, draftCode);
                                    }}
                                >
                                    <Check className="inline mr-1" /> Save
                                </Button>
                            </div>
                        )}

                        <div className="mt-4 flex justify-center space-x-2">
                            {variants.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={cn(
                                        'w-3 h-3 rounded-full transition-all',
                                        idx === currentIndex
                                            ? 'bg-blue-600 scale-110'
                                            : 'bg-gray-300'
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {variants.length > 1 && (
                        <>
                            <button
                                onClick={goPrev}
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
                                aria-label="Previous"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <button
                                onClick={goNext}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow"
                                aria-label="Next"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
}
