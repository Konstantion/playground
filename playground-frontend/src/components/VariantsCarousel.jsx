import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Editor } from '@monaco-editor/react';
import {
    AlertCircle,
    Check,
    ChevronLeft,
    ChevronRight,
    Edit,
    FileText,
    Lock,
    Trash2,
    X,
} from 'lucide-react';

import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { Action, actionStr } from '@/entities/Action.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { Routes as RRoutes } from '@/rout/Routes.jsx';
import { sNotEmpty } from '@/utils/ObjectUtils.js';
import { Badge } from '@/components/ui/badge.js';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';

export function VariantsCarousel({
    className,
    question,
    correct,
    title,
    variants,
    language,
    setQuestion,
    isEditable,
}) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [editingId, setEditingId] = useState(null);
    const [draftCode, setDraftCode] = useState('');
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [variantToDelete, setVariantToDelete] = useState(null);

    useEffect(() => {
        setEditingId(null);
    }, [currentIndex, variants]);

    useEffect(() => {
        if (variants && variants.length > 0 && currentIndex >= variants.length) {
            setCurrentIndex(Math.max(0, variants.length - 1));
        }
    }, [variants, currentIndex]);

    if (!variants || variants.length === 0) {
        return (
            <Card
                className={cn(
                    'shadow-lg rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col',
                    className
                )}
            >
                <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                        {title}
                    </CardTitle>
                    <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                        {correct ? 'Correct answer examples' : 'Incorrect answer examples'}
                    </CardDescription>
                </CardHeader>
                <div className="flex-1 flex flex-col items-center justify-center text-sm text-slate-500 dark:text-slate-400 p-6 text-center">
                    <FileText size={40} className="mb-3 text-slate-400 dark:text-slate-500" />
                    <p className="font-medium">
                        No {correct ? 'correct' : 'incorrect'} variants yet.
                    </p>
                    <p className="text-xs">Add some variants to this question.</p>
                </div>
            </Card>
        );
    }

    const goPrev = () => setCurrentIndex(i => (i === 0 ? variants.length - 1 : i - 1));
    const goNext = () => setCurrentIndex(i => (i === variants.length - 1 ? 0 : i + 1));

    const confirmDeleteVariant = async () => {
        if (!variantToDelete) return;
        const variantId = variantToDelete.id;
        setIsDeleteDialogOpen(false);

        const patchBody = {
            action: actionStr(Action.REMOVE),
            ...(correct ? { correctVariant: variantId } : { incorrectVariant: variantId }),
        };

        let success = false;

        await authenticatedReq(
            `${Endpoints.Questions.Base}/${question.id}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(message || `Failed to remove variant from question.`, {
                    closeButton: true,
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            response => {
                if (sNotEmpty(response?.updated)) {
                    success = true;
                    setQuestion(response.updated);

                    if (
                        currentIndex >=
                        response.updated[correct ? 'correctVariants' : 'incorrectVariants'].length
                    ) {
                        setCurrentIndex(
                            Math.max(
                                0,
                                response.updated[correct ? 'correctVariants' : 'incorrectVariants']
                                    .length - 1
                            )
                        );
                    }
                    toast.success('Variant association removed from question.', { duration: 3000 });
                }
                if (sNotEmpty(response?.violations)) {
                    Object.entries(response.violations).forEach(([key, value]) => {
                        toast.error(
                            `Validation error for ${key}: ${value.join(' and ').toLowerCase()}.`,
                            { closeButton: true }
                        );
                    });
                }
            }
        );

        if (success) {
            await authenticatedReq(
                `${Endpoints.Variant.Base}/${variantId}`,
                'DELETE',
                null,
                auth.accessToken,
                (type, message) => {
                    toast.error(message || 'Failed to delete variant entity.', {
                        closeButton: true,
                        duration: 5000,
                    });
                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                },
                () => {
                    toast.success('Variant deleted successfully!', { duration: 3000 });
                }
            );
        }
        setVariantToDelete(null);
    };

    const openDeleteDialog = variant => {
        setVariantToDelete(variant);
        setIsDeleteDialogOpen(true);
    };

    const updateVariant = async (variantId, newCode) => {
        if (!newCode || newCode.trim() === '') {
            toast.warning('Code cannot be empty.', { duration: 3000 });
            return;
        }
        const patchBody = { code: newCode };

        await authenticatedReq(
            `${Endpoints.Variant.Base}/${variantId}`,
            'PATCH',
            patchBody,
            auth.accessToken,
            (type, message) => {
                toast.error(message || 'Failed to update variant.', {
                    closeButton: true,
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            updatedVariantResponse => {
                if (sNotEmpty(updatedVariantResponse)) {
                    const updatedVariantsList = variants.map(v =>
                        v.id === updatedVariantResponse.id ? updatedVariantResponse : v
                    );

                    setQuestion(prevQuestion => {
                        const newQuestionState = { ...prevQuestion };
                        if (correct) {
                            newQuestionState.correctVariants = updatedVariantsList;
                        } else {
                            newQuestionState.incorrectVariants = updatedVariantsList;
                        }
                        newQuestionState.validated = false;
                        return newQuestionState;
                    });
                    toast.success('Variant updated successfully!', { duration: 3000 });
                } else {
                    toast.error('Failed to update variant: No response data.', {
                        closeButton: true,
                    });
                }
            }
        );
        setEditingId(null);
    };

    const currentVariant = variants[currentIndex];
    const isEditing = currentVariant.id === editingId;
    const editorTheme = document.documentElement.classList.contains('dark')
        ? 'vs-dark'
        : 'vs-light';

    return (
        <>
            <Card
                className={cn(
                    'shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col overflow-hidden',
                    className
                )}
            >
                <CardHeader className="pb-2 pt-4 px-4 sm:px-5">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                                {title}
                            </CardTitle>
                            <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                                {correct ? 'Correct answer examples' : 'Incorrect answer examples'}{' '}
                                ({currentIndex + 1} of {variants.length})
                            </CardDescription>
                        </div>

                        <div className="flex space-x-1.5">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-slate-500 hover:text-sky-600 dark:hover:text-sky-500 h-8 w-8 rounded-full disabled:text-slate-400 disabled:dark:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                onClick={() => {
                                    setDraftCode(currentVariant.code.code);
                                    setEditingId(currentVariant.id);
                                }}
                                disabled={isEditing || !isEditable}
                                aria-label="Edit variant"
                                title={
                                    !isEditable
                                        ? 'Cannot edit variants for an immutable question'
                                        : 'Edit variant'
                                }
                            >
                                {isEditable ? <Edit size={16} /> : <Lock size={16} />}
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="text-slate-500 hover:text-red-600 dark:hover:text-red-500 h-8 w-8 rounded-full disabled:text-slate-400 disabled:dark:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                                onClick={() => openDeleteDialog(currentVariant)}
                                disabled={isEditing || !isEditable}
                                aria-label="Delete variant"
                                title={
                                    !isEditable
                                        ? 'Cannot delete variants for an immutable question'
                                        : 'Delete variant'
                                }
                            >
                                {isEditable ? <Trash2 size={16} /> : <Lock size={16} />}
                            </Button>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className="mt-2 text-xs w-fit dark:border-slate-600 dark:text-slate-400"
                    >
                        ID: {currentVariant.id}
                    </Badge>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col p-3 sm:p-4 min-h-0 relative">
                    <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden relative">
                        <Editor
                            key={currentVariant.id + (isEditing ? '-editing' : '-readonly')}
                            height="200px"
                            language={language}
                            value={isEditing ? draftCode : currentVariant.code.code}
                            onMount={editor => {
                                if (isEditing) editor.focus();
                            }}
                            onChange={val => isEditing && setDraftCode(val ?? '')}
                            options={{
                                minimap: { enabled: false },
                                scrollBeyondLastLine: false,
                                readOnly: !isEditing,
                                fontSize: 13,
                                letterSpacing: 0.5,
                                wordWrap: 'on',
                                automaticLayout: true,
                            }}
                            theme={editorTheme}
                        />
                    </div>

                    {isEditing && (
                        <div className="mt-3 flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingId(null)}
                                className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                            >
                                <X className="inline mr-1.5 h-4 w-4" /> Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={() => updateVariant(currentVariant.id, draftCode)}
                                className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                            >
                                <Check className="inline mr-1.5 h-4 w-4" /> Save Changes
                            </Button>
                        </div>
                    )}

                    {variants.length > 1 && (
                        <div className="flex justify-center items-center mt-3 space-x-4">
                            <Button
                                onClick={goPrev}
                                variant="outline"
                                size="icon"
                                className="rounded-full h-9 w-9 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                aria-label="Previous variant"
                            >
                                <ChevronLeft size={20} />
                            </Button>

                            <div className="flex space-x-1.5">
                                {variants.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentIndex(idx)}
                                        className={cn(
                                            'w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800',
                                            idx === currentIndex
                                                ? 'bg-sky-600 dark:bg-sky-500 scale-125'
                                                : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                                        )}
                                        aria-label={`Go to variant ${idx + 1}`}
                                    />
                                ))}
                            </div>

                            <Button
                                onClick={goNext}
                                variant="outline"
                                size="icon"
                                className="rounded-full h-9 w-9 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                aria-label="Next variant"
                            >
                                <ChevronRight size={20} />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="dark:bg-slate-800">
                    <DialogHeader>
                        <DialogTitle className="flex items-center">
                            <AlertCircle className="text-red-500 mr-2" size={24} />
                            Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="dark:text-slate-400 py-2">
                            Are you sure you want to delete this {correct ? 'correct' : 'incorrect'}{' '}
                            variant?
                            <div className="mt-2 p-2 border dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700/50 text-xs max-h-24 overflow-y-auto">
                                <pre className="whitespace-pre-wrap">
                                    {variantToDelete?.code?.code}
                                </pre>
                            </div>
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={confirmDeleteVariant}>
                            Delete Variant
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
