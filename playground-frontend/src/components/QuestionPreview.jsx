import React, {useMemo, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {ScrollArea} from '@/components/ui/scroll-area';
import {CheckCircle, Edit, XCircle} from 'lucide-react';
import {CodeBlock} from '@/components/code/CodeBlock.jsx';
import {Badge} from '@/components/ui/badge';
import {prettierStr} from '@/entities/Placeholder.js';
import {Input} from '@/components/ui/input.js';
import {Editor} from '@monaco-editor/react';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog.js';
import {Button} from '@/components/ui/button.js';
import {DialogDescription} from '@radix-ui/react-dialog';
import {Action, actionStr} from '@/entities/Action.js';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {useAuth} from '@/hooks/useAuth.jsx';
import {useNavigate} from 'react-router-dom';
import {toast} from 'sonner';
import {ErrorType} from '@/utils/ErrorType.js';
import {Routes as RRoutes} from '@/rout/Routes.jsx';
import {sNotEmpty} from '@/utils/ObjectUtils.js';

export default function QuestionPreview({question, className, setQuestion}) {
    const {auth, logout} = useAuth();
    const navigate = useNavigate();
    const [isNameOpen, setIsNameOpen] = useState(false);
    const [draftName, setDraftName] = useState(question.body);

    const [isFCOpen, setIsFCOpen] = useState(false);
    const [draftFormat, setDraftFormat] = useState(question.formatAndCode.format);
    const [draftCode, setDraftCode] = useState(question.formatAndCode.code);

    const placeholderRegex = useMemo(() => {
        const keys = Object.keys(question.placeholderDefinitions).join('|');
        return new RegExp(`\\b(${keys})\\b`, 'g');
    }, [question.placeholderDefinitions]);

    const onNameSave = async newName => {
        const patchBody = {
            action: actionStr(Action.ADD),
            body: newName,
        };

        await doUpdateReq(patchBody);

        setIsNameOpen(false);
    };

    const onFormatAndCodeSave = async (format, code) => {
        const patchBody = {
            action: actionStr(Action.ADD),
            formatAndCodeDto: {
                format: format,
                code: code,
            },
        };

        await doUpdateReq(patchBody);

        setIsFCOpen(false);
    };

    const doUpdateReq = async body => {
        await authenticatedReq(
            Endpoints.Questions.Base + `/${question.id}`,
            'PATCH',
            body,
            auth.accessToken,
            (type, message) => {
                toast.error(message, {closeButton: true, duration: 10_000});
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            response => {
                if (sNotEmpty(response?.updated)) {
                    setQuestion(response.updated);
                }

                if (sNotEmpty(response?.violations)) {
                    Object.entries(response.violations).forEach(([key, value]) => {
                        toast.error(
                            `Violation error for ${key}, ${value.join('and ').toLowerCase()}.`,
                            {closeButton: true}
                        );
                    });
                }
            }
        );
    };

    return (
        <Card className={`${className} flex flex-col min-h-0`}>
            <CardHeader>
                <CardTitle>Question #{question.id}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 min-h-0">
                <ScrollArea className="flex-1 min-h-0">
                    <div className="flex flex-col space-y-4 p-2">
                        <section className={'rounded-lg border bg-card p-4 shadow-sm'}>
                            <h4 className="font-medium">Language</h4>
                            <Badge>{question.lang}</Badge>
                        </section>

                        <section className="flex items-start justify-between rounded-lg border bg-card p-4 shadow-sm">
                            <div>
                                <h4 className="font-medium">Name</h4>
                                <p className="whitespace-pre-wrap">{question.body}</p>
                            </div>
                            <Dialog open={isNameOpen} onOpenChange={setIsNameOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <Edit size={16}/>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Name</DialogTitle>
                                        <DialogDescription>
                                            Change name for this question.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Input
                                        value={draftName}
                                        onChange={e => setDraftName(e.target.value)}
                                    />
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsNameOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={() => onNameSave(draftName)}>Save</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </section>

                        <section className="flex flex-col rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Formatted Code</h4>
                                <Dialog open={isFCOpen} onOpenChange={setIsFCOpen}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" size="sm">
                                            <Edit size={16}/>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl w-full">
                                        <DialogHeader>
                                            <DialogTitle>Edit Format &amp; Code</DialogTitle>
                                            <DialogDescription>
                                                Change the format and code for this question.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block mb-1 font-medium">
                                                    Language
                                                </label>
                                                <Input
                                                    value={draftFormat}
                                                    onChange={e => setDraftFormat(e.target.value)}
                                                    placeholder="e.g. javascript"
                                                />
                                            </div>

                                            <div className="h-80 relative">
                                                <Editor
                                                    height="100%"
                                                    defaultLanguage={draftFormat}
                                                    value={draftCode}
                                                    onMount={(editor, monaco) => {
                                                        let decorations = [];
                                                        const highlight = () => {
                                                            const model = editor.getModel();
                                                            if (!model) return;
                                                            const text = model.getValue();
                                                            const ranges = [];
                                                            let match;
                                                            while (
                                                                (match =
                                                                    placeholderRegex.exec(text)) !==
                                                                null
                                                                ) {
                                                                const startPos =
                                                                    model.getPositionAt(
                                                                        match.index
                                                                    );
                                                                const endPos = model.getPositionAt(
                                                                    match.index + match[0].length
                                                                );
                                                                ranges.push({
                                                                    range: new monaco.Range(
                                                                        startPos.lineNumber,
                                                                        startPos.column,
                                                                        endPos.lineNumber,
                                                                        endPos.column
                                                                    ),
                                                                    options: {
                                                                        inlineClassName:
                                                                            'placeholder-highlight',
                                                                    },
                                                                });
                                                            }
                                                            decorations = editor.deltaDecorations(
                                                                decorations,
                                                                ranges
                                                            );
                                                        };
                                                        highlight();
                                                        editor.onDidChangeModelContent(highlight);
                                                    }}
                                                    onChange={val => setDraftCode(val ?? '')}
                                                    options={{minimap: {enabled: false}}}
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsFCOpen(false)}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    onFormatAndCodeSave(draftFormat, draftCode)
                                                }
                                            >
                                                Save
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <CodeBlock
                                className="h-40 text-sm"
                                language={question.formatAndCode.format}
                                code={question.formatAndCode.code}
                                placeholders={new Set(Object.keys(question.placeholderDefinitions))}
                            />
                        </section>

                        <section className={'rounded-lg border bg-card p-4 shadow-sm'}>
                            <h4 className="font-medium">Validated</h4>
                            {question.validated ? (
                                <CheckCircle className="text-green-500 w-4 h-4"/>
                            ) : (
                                <XCircle className="text-red-500 w-4 h-4"/>
                            )}
                        </section>

                        <section className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
                            <h4 className="font-medium">Placeholders</h4>
                            {Object.entries(question.placeholderDefinitions).map(([key, value]) => {
                                return (
                                    <Badge key={key} variant={'outline'} className="text-md">
                                        {`${key} → ${prettierStr(value)}`}
                                    </Badge>
                                );
                            })}
                        </section>

                        <section className="flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm">
                            <h4 className="font-medium">Call Args</h4>
                            {Object.entries(question.callArgs).map(([key, value]) => {
                                return (
                                    <Badge key={key} variant={'outline'} className="text-md">
                                        {`${value.identifier} → ${JSON.stringify(value.name)}`}
                                    </Badge>
                                );
                            })}
                        </section>

                        <p className="text-sm text-gray-500">
                            Created at: {new Date(question.createdAt).toLocaleString()}
                        </p>
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
