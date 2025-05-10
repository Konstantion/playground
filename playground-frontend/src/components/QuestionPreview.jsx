import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    CalendarDays,
    CheckCircle,
    Code2,
    Edit,
    Info,
    Languages,
    Lock,
    Tag,
    Trash2,
    XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { prettierStr } from '@/entities/Placeholder.js';
import { Input } from '@/components/ui/input.js';
import { Editor } from '@monaco-editor/react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import { Button } from '@/components/ui/button.js';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { RHome, Routes as RRoutes } from '@/rout/Routes.jsx';
import { sNotEmpty } from '@/utils/ObjectUtils.js';
import { QuestionsPage } from '@/pages/Pages.js';
import { between } from '@/utils/Strings.js';
import { cn } from '@/lib/utils.js';

export default function QuestionPreview({ question, className, setQuestion, isEditable }) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [isNameOpen, setIsNameOpen] = useState(false);
    const [draftName, setDraftName] = useState(question.body);

    const [isFCOpen, setIsFCOpen] = useState(false);
    const [draftFormat, setDraftFormat] = useState(question.formatAndCode.format);
    const [draftCode, setDraftCode] = useState(question.formatAndCode.code);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [editorTheme, setEditorTheme] = useState(
        document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'
    );

    useEffect(() => {
        const observer = new MutationObserver(mutationsList => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    setEditorTheme(
                        document.documentElement.classList.contains('dark') ? 'vs-dark' : 'vs-light'
                    );
                }
            }
        });
        observer.observe(document.documentElement, { attributes: true });
        return () => observer.disconnect();
    }, []);

    const placeholderRegex = useMemo(() => {
        const placeholderKeys = Object.keys(question.placeholderDefinitions);
        if (placeholderKeys.length === 0) return null;
        const keys = placeholderKeys
            .map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');
        return new RegExp(`\\b(${keys})\\b`, 'g');
    }, [question.placeholderDefinitions]);

    const doUpdateReq = async (body, successMessage) => {
        await authenticatedReq(
            `${Endpoints.Questions.Base}/${question.id}`,
            'PATCH',
            body,
            auth.accessToken,
            (type, message) => {
                toast.error(message || 'Update failed.', { closeButton: true, duration: 5000 });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            response => {
                if (sNotEmpty(response?.updated)) {
                    setQuestion(response.updated);
                    toast.success(successMessage || 'Question updated successfully!', {
                        duration: 3000,
                    });
                }
                if (sNotEmpty(response?.violations)) {
                    Object.entries(response.violations).forEach(([key, value]) => {
                        toast.error(
                            `Validation error for ${key}: ${value.join(' and ').toLowerCase()}.`,
                            { closeButton: true, duration: 7000 }
                        );
                    });
                }
            }
        );
    };

    const onNameSave = async () => {
        if (!between(draftName, 1, 100)) {
            toast.error('Question name must be 1-100 characters.', { closeButton: true });
            return;
        }
        await doUpdateReq({ action: 'ADD', body: draftName }, 'Question name updated!');
        setIsNameOpen(false);
    };

    const onFormatAndCodeSave = async () => {
        if (!between(draftCode, 1, 1000)) {
            toast.error('Code must be 1-1000 characters.', { closeButton: true });
            return;
        }
        if (!between(draftFormat, 1, 50)) {
            toast.error('Format (language) must be 1-50 characters.', { closeButton: true });
            return;
        }
        await doUpdateReq(
            { action: 'ADD', formatAndCodeDto: { format: draftFormat, code: draftCode } },
            'Format & Code updated!'
        );
        setIsFCOpen(false);
    };

    const onDeleteConfirm = async () => {
        setIsDeleteOpen(false);
        await authenticatedReq(
            `${Endpoints.Questions.Base}/${question.id}`,
            'DELETE',
            {},
            auth.accessToken,
            (type, message) =>
                toast.error(message || 'Failed to delete question.', {
                    closeButton: true,
                    duration: 5000,
                }),
            () => {
                toast.success('Question deleted successfully.');
                navigate(`${RHome}/${QuestionsPage}`);
            }
        );
    };

    const InfoSection = ({ title, icon, children, onEdit, editDisabled = false }) => (
        <section className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center text-slate-700 dark:text-slate-300">
                    {React.cloneElement(icon, {
                        size: 18,
                        className: 'mr-2 text-sky-600 dark:text-sky-500',
                    })}
                    <h4 className="font-semibold text-sm uppercase tracking-wider">{title}</h4>
                </div>

                {onEdit && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-500 hover:text-sky-600 dark:hover:text-sky-500 h-8 w-8 disabled:text-slate-400 disabled:dark:text-slate-600 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                        onClick={onEdit}
                        disabled={editDisabled || !isEditable}
                        title={!isEditable ? 'Cannot edit an immutable question' : 'Edit'}
                    >
                        {isEditable ? <Edit size={16} /> : <Lock size={16} />}
                    </Button>
                )}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm">{children}</div>
        </section>
    );

    const applyPlaceholderHighlighting = (editor, monaco) => {
        if (!editor || !monaco || !placeholderRegex) return [];

        const model = editor.getModel();
        if (!model) return [];

        const text = model.getValue();
        const ranges = [];
        let match;
        while ((match = placeholderRegex.exec(text)) !== null) {
            const startPos = model.getPositionAt(match.index);
            const endPos = model.getPositionAt(match.index + match[0].length);
            ranges.push({
                range: new monaco.Range(
                    startPos.lineNumber,
                    startPos.column,
                    endPos.lineNumber,
                    endPos.column
                ),
                options: {
                    inlineClassName: 'placeholder-highlight',
                    hoverMessage: { value: `Placeholder: ${match[0]}` },
                },
            });
        }
        return editor.deltaDecorations([], ranges);
    };

    return (
        <Card
            className={cn(
                'shadow-xl rounded-xl dark:bg-slate-850 border dark:border-slate-700/50 flex flex-col overflow-hidden',
                className
            )}
        >
            <CardHeader className="bg-slate-50 dark:bg-slate-800 p-4 sm:p-5 border-b dark:border-slate-700/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
                        Question Details{' '}
                        <span className="text-sky-600 dark:text-sky-500">#{question.id}</span>
                    </CardTitle>

                    <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="rounded-full w-9 h-9 sm:w-10 sm:h-10 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Delete question"
                                disabled={!isEditable}
                                title={
                                    !isEditable
                                        ? 'Cannot delete an immutable question'
                                        : 'Delete question'
                                }
                            >
                                {isEditable ? <Trash2 size={18} /> : <Lock size={18} />}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="dark:bg-slate-800">
                            <DialogHeader>
                                <DialogTitle className="text-red-600 dark:text-red-500">
                                    Confirm Deletion
                                </DialogTitle>
                                <DialogDescription className="dark:text-slate-400">
                                    Are you sure you want to delete question{' '}
                                    <span className="font-semibold">#{question.id}</span>? This
                                    action cannot be undone.
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
                                <Button variant="destructive" onClick={onDeleteConfirm}>
                                    Delete Question
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>

                <Badge
                    variant={isEditable ? 'secondary' : 'outline'}
                    className={cn(
                        'mt-2 text-xs w-fit',
                        isEditable
                            ? 'dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                            : 'dark:border-amber-600 dark:text-amber-400 dark:bg-amber-900/30 border-amber-400 text-amber-700 bg-amber-50'
                    )}
                >
                    {isEditable ? 'Public / Editable' : 'Immutable / Read-Only'}
                </Badge>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden min-h-0">
                <ScrollArea className="h-full max-h-[calc(80vh-120px)] sm:max-h-[calc(100vh-250px)] md:max-h-[600px] lg:max-h-[70vh] xl:max-h-[65vh]">
                    <div className="p-4 sm:p-5 space-y-4">
                        <Dialog open={isNameOpen} onOpenChange={setIsNameOpen}>
                            <InfoSection
                                title="Name / Body"
                                icon={<Info />}
                                onEdit={() => {
                                    setDraftName(question.body);
                                    setIsNameOpen(true);
                                }}
                                editDisabled={!isEditable} // Disable edit if not editable
                            >
                                <p className="whitespace-pre-wrap text-base font-medium text-slate-700 dark:text-slate-200">
                                    {question.body}
                                </p>
                            </InfoSection>

                            <DialogContent className="dark:bg-slate-800">
                                <DialogHeader>
                                    <DialogTitle className="dark:text-slate-100">
                                        Edit Question Name / Body
                                    </DialogTitle>
                                </DialogHeader>
                                <Input
                                    value={draftName}
                                    onChange={e => setDraftName(e.target.value)}
                                    placeholder="Enter question name / body"
                                    className="my-4 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                    maxLength={100}
                                />
                                <DialogFooter className="mt-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={onNameSave}
                                        className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                                    >
                                        Save Name
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <InfoSection title="Language" icon={<Languages />}>
                            <Badge
                                variant="secondary"
                                className="text-sm dark:bg-slate-700 dark:text-sky-400"
                            >
                                {question.lang}
                            </Badge>
                        </InfoSection>

                        <Dialog open={isFCOpen} onOpenChange={setIsFCOpen}>
                            <InfoSection
                                title="Formatted Code & Language"
                                icon={<Code2 />}
                                onEdit={() => {
                                    setDraftFormat(question.formatAndCode.format);
                                    setDraftCode(question.formatAndCode.code);
                                    setIsFCOpen(true);
                                }}
                                editDisabled={!isEditable} // Disable edit if not editable
                            >
                                <div className="h-40 border dark:border-slate-700 rounded-md overflow-hidden relative bg-white dark:bg-slate-900">
                                    <Editor
                                        key={`display-${question.id}-${question.formatAndCode.code}`}
                                        height="100%"
                                        language={question.formatAndCode.format.toLowerCase()}
                                        value={question.formatAndCode.code}
                                        theme={editorTheme}
                                        onMount={(editor, monaco) => {
                                            applyPlaceholderHighlighting(editor, monaco);
                                            editor.layout();
                                        }}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            wordWrap: 'on',
                                            fontSize: 12,
                                            renderWhitespace: 'boundary',
                                            contextmenu: false,
                                            copyWithSyntaxHighlighting: false,
                                            lineNumbers: 'on',
                                        }}
                                    />
                                </div>
                            </InfoSection>

                            <DialogContent className="max-w-3xl w-[95vw] sm:w-full dark:bg-slate-800">
                                <DialogHeader>
                                    <DialogTitle className="dark:text-slate-100">
                                        Edit Format & Code
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 my-4">
                                    <div>
                                        <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Display Language
                                        </label>
                                        <Input
                                            value={draftFormat}
                                            onChange={e => setDraftFormat(e.target.value)}
                                            placeholder="e.g., python"
                                            className="dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
                                            maxLength={50}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1.5 text-sm font-medium text-slate-700 dark:text-slate-300">
                                            Code Snippet
                                        </label>
                                        <div className="h-80 relative border border-slate-300 dark:border-slate-700 rounded-md overflow-hidden">
                                            {isFCOpen && (
                                                <Editor
                                                    key={
                                                        isFCOpen
                                                            ? 'fc-editor-visible'
                                                            : 'fc-editor-hidden'
                                                    }
                                                    height="100%"
                                                    language={
                                                        draftFormat
                                                            ? draftFormat.toLowerCase()
                                                            : 'plaintext'
                                                    }
                                                    value={draftCode}
                                                    theme={editorTheme}
                                                    onMount={(editor, monaco) => {
                                                        applyPlaceholderHighlighting(
                                                            editor,
                                                            monaco
                                                        );
                                                        editor.layout();
                                                        editor.focus();
                                                    }}
                                                    onChange={val => setDraftCode(val ?? '')}
                                                    options={{
                                                        minimap: { enabled: false },
                                                        scrollBeyondLastLine: false,
                                                        fontSize: 13,
                                                        letterSpacing: 0.5,
                                                        wordWrap: 'on',
                                                        automaticLayout: true,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="mt-2">
                                    <DialogClose asChild>
                                        <Button
                                            variant="outline"
                                            className="dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        onClick={onFormatAndCodeSave}
                                        className="bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                                    >
                                        Save
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <InfoSection
                            title="Validation Status"
                            icon={question.validated ? <CheckCircle /> : <XCircle />}
                        >
                            {question.validated ? (
                                <span className="inline-flex items-center text-green-600 dark:text-green-400">
                                    <CheckCircle className="w-5 h-5 mr-1.5" /> Validated
                                </span>
                            ) : (
                                <span className="inline-flex items-center text-red-600 dark:text-red-500">
                                    <XCircle className="w-5 h-5 mr-1.5" /> Not Validated
                                </span>
                            )}
                        </InfoSection>

                        <InfoSection title="Placeholders" icon={<Tag />}>
                            {Object.keys(question.placeholderDefinitions).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {Object.entries(question.placeholderDefinitions).map(
                                        ([key, value]) => (
                                            <Badge
                                                key={key}
                                                variant={'outline'}
                                                className="text-xs sm:text-sm px-2.5 py-1 dark:border-slate-600 dark:text-slate-300 dark:bg-slate-700/50"
                                            >
                                                <span className="font-semibold text-sky-600 dark:text-sky-500">
                                                    {key}
                                                </span>
                                                : {prettierStr(value)}
                                            </Badge>
                                        )
                                    )}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 italic">
                                    No placeholders defined.
                                </p>
                            )}
                        </InfoSection>

                        <InfoSection title="Call Arguments" icon={<Tag />}>
                            {question.callArgs && Object.keys(question.callArgs).length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(question.callArgs).map(value => (
                                        <Badge
                                            key={value.name}
                                            variant={'outline'}
                                            className="text-xs sm:text-sm px-2.5 py-1 dark:border-slate-600 dark:text-slate-300 dark:bg-slate-700/50"
                                        >
                                            <span className="font-semibold text-purple-600 dark:text-purple-400">
                                                {value.name}
                                            </span>{' '}
                                            &rarr;{' '}
                                            <span className="text-sky-600 dark:text-sky-500">
                                                {value.identifier}
                                            </span>
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 italic">
                                    No call arguments defined.
                                </p>
                            )}
                        </InfoSection>

                        <InfoSection title="Created At" icon={<CalendarDays />}>
                            <p>{new Date(question.createdAt).toLocaleString()}</p>
                        </InfoSection>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
