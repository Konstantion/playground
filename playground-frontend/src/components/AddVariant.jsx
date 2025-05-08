import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import EEditor from '@/components/code/EEditor.jsx';
import {Checkbox} from '@/components/ui/checkbox.js';
import {Label} from '@/components/ui/label.js';
import {parse} from '@/entities/Placeholder.js';
import {InlineCode} from '@/components/code/InlineCode.jsx';
import {useEffect, useMemo, useState} from 'react';
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
import {cn} from '@/lib/utils';
import {CheckSquare, FilePlus2, PlusCircle, Square, TerminalSquare} from 'lucide-react';

const buildSignature = question => {
    if (!question || !question.lang) return '// Language not specified';

    if (question.lang.toLowerCase() === 'python') {
        let signature = 'def signature_helper(';
        if (question.callArgs && Array.isArray(question.callArgs)) {
            question.callArgs.forEach(arg => {
                const { name, identifier } = arg;
                const definition = question.placeholderDefinitions
                    ? question.placeholderDefinitions[identifier]
                    : null;
                let typeDesc = 'Any';
                if (definition) {
                    const parsedDef = parse(definition);
                    if (parsedDef && parsedDef.return) {
                        typeDesc = parsedDef.return === 'i32' ? 'int' : parsedDef.return;
                    }
                }
                signature += `${name}: ${typeDesc}, `;
            });
        }
        const end = signature.endsWith('(') ? signature.length : signature.length - 2;
        return signature.substring(0, end) + ') -> str:';
    } else {
        let signature = `function signatureHelper(`;
        if (question.callArgs && Array.isArray(question.callArgs)) {
            question.callArgs.forEach(arg => {
                signature += `${arg.name}, `;
            });
        }
        const end = signature.endsWith('(') ? signature.length : signature.length - 2;
        return signature.substring(0, end) + `) { /* returns string */ }`;
    }
};

const buildComment = question => {
    if (!question || !question.lang) return '// Write function body here';
    if (question.lang.toLowerCase() === 'python') {
        return '\n    # Write function body here\n    # Ensure it returns a string\n    pass';
    } else {
        return '\n  // Write function body here\n  // Ensure it returns a string\n';
    }
};

export default function AddVariant({ question, setQuestion, className }) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [code, setCode] = useState(() => buildComment(question));
    const [isCorrect, setIsCorrect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const signature = useMemo(() => buildSignature(question), [question]);
    const editorTheme = document.documentElement.classList.contains('dark')
        ? 'vs-dark'
        : 'vs-light';

    useEffect(() => {
        setCode(buildComment(question));
    }, [question.id, question.lang, question.callArgs, question.placeholderDefinitions]);

    const createVariant = async () => {
        if (!code || code.trim() === '' || code.trim() === buildComment(question).trim()) {
            toast.warning('Please write some code for the variant.', { duration: 3000 });
            return;
        }
        setIsLoading(true);
        const variantBody = { code: code };

        let variantRef;

        await authenticatedReq(
            Endpoints.Variant.Base,
            'POST',
            variantBody,
            auth.accessToken,
            (type, message) => {
                toast.error(message || 'Failed to create variant entity.', {
                    closeButton: true,
                    duration: 5000,
                });
                if (type === ErrorType.TokenExpired) {
                    logout();
                    navigate(RRoutes.Login.path);
                }
                setIsLoading(false);
            },
            variantResponse => {
                variantRef = variantResponse;
            }
        );

        if (variantRef && variantRef.id) {
            const patchBody = {
                action: actionStr(Action.ADD),
                ...(isCorrect
                    ? { correctVariant: variantRef.id }
                    : { incorrectVariant: variantRef.id }),
            };

            await authenticatedReq(
                `${Endpoints.Questions.Base}/${question.id}`,
                'PATCH',
                patchBody,
                auth.accessToken,
                (type, message) => {
                    toast.error(message || 'Failed to link variant to question.', {
                        closeButton: true,
                        duration: 5000,
                    });

                    if (type === ErrorType.TokenExpired) {
                        logout();
                        navigate(RRoutes.Login.path);
                    }
                    setIsLoading(false);
                },
                response => {
                    if (sNotEmpty(response?.updated)) {
                        toast.success(`Variant added successfully to question!`, {
                            duration: 3000,
                        });
                        setQuestion(response.updated);
                        setCode(buildComment(question));
                        setIsCorrect(false);
                    }
                    if (sNotEmpty(response?.violations)) {
                        Object.entries(response.violations).forEach(([key, value]) => {
                            toast.error(
                                `Validation error for ${key}: ${value.join(' and ').toLowerCase()}.`,
                                { closeButton: true }
                            );
                        });
                    }
                    setIsLoading(false);
                }
            );
        } else {
            setIsLoading(false);
        }
    };

    return (
        <Card
            className={cn(
                'shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col',
                className
            )}
        >
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <div className="flex items-center">
                    <FilePlus2 size={20} className="mr-2.5 text-sky-600 dark:text-sky-500" />
                    <div>
                        <CardTitle className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Add New Variant
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Provide a code solution and mark its correctness.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 min-h-0">
                {/* Function Signature Display */}
                <div className="bg-slate-100 dark:bg-slate-700/50 p-2.5 sm:p-3 rounded-md text-xs sm:text-sm">
                    <div className="flex items-center text-slate-600 dark:text-slate-300 mb-4">
                        <TerminalSquare size={16} className="mr-2 text-sky-500" />
                        <span className="font-medium">Function Signature:</span>
                    </div>
                    <InlineCode code={signature} language={question.lang.toLowerCase()} />
                </div>

                {/* Code Editor */}
                <div className="flex-1 border border-slate-200 dark:border-slate-700 rounded-md overflow-hidden min-h-[200px] sm:min-h-[250px]">
                    <EEditor
                        language={question.lang.toLowerCase()}
                        initialCode={code}
                        onChange={setCode}
                        editable={true}
                        key={question.id + question.lang}
                    />
                </div>

                {/* Correctness Checkbox */}
                <div className="flex items-center space-x-2.5 pt-1">
                    <Checkbox
                        id={`isCorrect-${question.id}`}
                        checked={isCorrect}
                        onCheckedChange={checked =>
                            typeof checked === 'boolean' && setIsCorrect(checked)
                        }
                        className="data-[state=checked]:bg-green-500 dark:data-[state=checked]:bg-green-600 border-slate-400 dark:border-slate-500"
                    />
                    <Label
                        htmlFor={`isCorrect-${question.id}`}
                        className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                    >
                        Mark as a correct variant
                    </Label>
                    {isCorrect ? (
                        <CheckSquare size={18} className="text-green-500" />
                    ) : (
                        <Square size={18} className="text-slate-400" />
                    )}
                </div>

                {/* Add Variant Button */}
                <div className="mt-auto">
                    <Button
                        onClick={createVariant}
                        className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Adding Variant...
                            </div>
                        ) : (
                            <>
                                <PlusCircle size={18} className="mr-2" /> Add Variant
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
