import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import EEditor from '@/components/code/EEditor.jsx';
import {Checkbox} from '@/components/ui/checkbox.js';
import {Label} from '@/components/ui/label.js';
import {parse} from '@/entities/Placeholder.js';
import {InlineCode} from '@/components/code/InlineCode.jsx';
import {useMemo, useState} from 'react';
import {useAuth} from '@/hooks/useAuth.jsx';
import {useNavigate} from 'react-router-dom';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {ErrorType} from '@/utils/ErrorType.js';
import {Routes as RRoutes} from '@/rout/Routes.jsx';
import {toast} from 'sonner';
import {Action, actionStr} from '@/entities/Action.js';
import {Button} from '@/components/ui/button.js';
import {sNotEmpty} from '@/utils/ObjectUtils.js';

const buildSignature = question => {
    if (question.lang === 'python') {
        let signature = 'def signature_helper(';
        question.callArgs.forEach(arg => {
            const { name, identifier } = arg;
            const definition = question.placeholderDefinitions[identifier];
            let desc;
            if (!definition) {
                desc = 'undefined';
            } else {
                let type = parse(definition).return;

                if (question.lang === 'python') {
                    if (type === 'i32') {
                        type = 'int';
                    }
                }

                desc = type;
            }

            if (question.lang === 'python') {
                signature += `${name}: ${desc}, `;
            }
        });
        const end = signature.endsWith('(') ? signature.length : signature.length - 2;
        return signature.substring(0, end).concat(`) -> str:`);
    } else {
        return `unhandled language ${question.lang}`;
    }
};

const buildComment = question => {
    if (question.lang === 'python') {
        return `# Write function body here`;
    } else {
        return `// Write function body here`;
    }
};

export default function AddVariant({ question, setQuestion }) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [code, setCode] = useState(buildComment(question));
    const [isCorrect, setIsCorrect] = useState(false);

    const signature = useMemo(() => buildSignature(question), [question]);

    const createVariant = async () => {
        const variantBody = {
            code: code,
        };

        let ref;
        await authenticatedReq(
            Endpoints.Variant.Base,
            'POST',
            variantBody,
            auth.accessToken,
            (type, message) => {
                toast.error(message, { closeButton: true, duration: 10_000 });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
            },
            variantResponse => {
                ref = variantResponse;
            }
        );

        if (ref) {
            const patchBody = {
                action: actionStr(Action.ADD),
            };

            if (isCorrect) {
                patchBody.correctVariant = ref.id;
            } else {
                patchBody.incorrectVariant = ref.id;
            }

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
                        toast.success('Variant added successfully', {
                            closeButton: true,
                            duration: 5_000,
                        });
                        setQuestion(response.updated);
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
        } else {
            toast.error('Failed to create variant', { closeButton: true, duration: 10_000 });
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Add Variant</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-2 p-4">
                <InlineCode code={signature} language={question.lang} />
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <EEditor
                        language={question.lang}
                        initialCode={code}
                        onChange={setCode}
                        editable={true}
                    />
                </div>
                <div className="flex flex-row">
                    <Label className="mr-2">Is variant correct?</Label>
                    <Checkbox
                        checked={isCorrect}
                        onCheckedChange={checked => {
                            if (typeof checked === 'boolean') {
                                setIsCorrect(checked);
                            }
                        }}
                    />
                </div>
                <Button onClick={createVariant}>Add</Button>
            </CardContent>
        </Card>
    );
}
