// playground-frontend/src/components/CallArgsConfigurator.jsx
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import { Action, actionStr, userStr } from '@/entities/Action.js';
import { Label } from '@/components/ui/label.js';
import { CallArgs, PlaceholderIdentifier } from '@/entities/Placeholder.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.js';
import { Button } from '@/components/ui/button.js';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { Routes as RRoutes } from '@/rout/Routes.jsx';
import { sNotEmpty } from '@/utils/ObjectUtils.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Link2, MinusCircle, PlusCircle, Settings2 } from 'lucide-react';

// Added isEditable prop
export default function CallArgsConfigurator({ id, question, setQuestion, className, isEditable }) {
    // ... (existing state and hooks remain the same) ...
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [action, setAction] = useState(Action.ADD);
    const [callArgName, setCallArgName] = useState(CallArgs.A);
    const [linkedIdentifier, setLinkedIdentifier] = useState(PlaceholderIdentifier.P_1);
    const [isLoading, setIsLoading] = useState(false);

    const availablePlaceholders = Object.keys(question.placeholderDefinitions || {});

    const selectCallArgName = () => (
        <div className="space-y-1.5">
            <Label
                htmlFor="call-arg-name"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                Argument Name
            </Label>
            {/* Disable Select if not editable */}
            <Select value={callArgName} onValueChange={setCallArgName} disabled={!isEditable}>
                <SelectTrigger
                    id="call-arg-name"
                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <SelectValue placeholder="Select argument name" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:text-slate-200">
                    {Object.values(CallArgs).map(arg => (
                        <SelectItem key={arg} value={arg}>
                            {arg}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const selectLinkedIdentifier = () => (
        <div className="space-y-1.5">
            <Label
                htmlFor="linked-identifier"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                Link to Placeholder Identifier
            </Label>
            {/* Disable Select if not editable or no placeholders */}
            <Select
                value={linkedIdentifier}
                onValueChange={setLinkedIdentifier}
                disabled={availablePlaceholders.length === 0 || !isEditable}
            >
                <SelectTrigger
                    id="linked-identifier"
                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <SelectValue placeholder="Select placeholder to link" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:text-slate-200">
                    {availablePlaceholders.length > 0 ? (
                        availablePlaceholders.map(placeholderId => (
                            <SelectItem key={placeholderId} value={placeholderId}>
                                {placeholderId}
                            </SelectItem>
                        ))
                    ) : (
                        <SelectItem value="none" disabled>
                            No placeholders defined
                        </SelectItem>
                    )}
                </SelectContent>
            </Select>
            {availablePlaceholders.length === 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">
                    Define placeholders first to link them as call arguments.
                </p>
            )}
        </div>
    );

    const handleAction = async () => {
        // ... (action logic remains the same) ...
        setIsLoading(true);
        const body = {
            action: actionStr(action),
        };

        if (action === Action.REMOVE) {
            body.args = [callArgName];
        } else {
            if (availablePlaceholders.length === 0) {
                toast.warning(
                    'Cannot add call argument. Please define at least one placeholder first.',
                    { duration: 4000 }
                );
                setIsLoading(false);
                return;
            }

            body.callArgs = [
                {
                    identifier: linkedIdentifier,
                    name: callArgName,
                },
            ];
        }

        await authenticatedReq(
            `${Endpoints.Questions.Base}/${id}`,
            'PATCH',
            body,
            auth.accessToken,
            (type, message) => {
                toast.error(message || `Failed to ${action.toLowerCase()} call argument.`, {
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
                    setQuestion(response.updated);
                    toast.success(
                        `Call argument '${callArgName}' successfully ${userStr(action)}!`,
                        { duration: 3000 }
                    );
                }
                if (sNotEmpty(response?.violations)) {
                    Object.entries(response.violations).forEach(([key, value]) => {
                        toast.error(
                            `Validation error for ${key}: ${value.join(' and ').toLowerCase()}.`,
                            { closeButton: true }
                        );
                    });
                } else if (!sNotEmpty(response?.updated) && !sNotEmpty(response?.violations)) {
                    toast.info(`Call argument operation for '${callArgName}' processed.`, {
                        duration: 3000,
                    });
                }
                setIsLoading(false);
            }
        );
    };

    return (
        <Card
            className={cn(
                'shadow-xl rounded-xl dark:bg-slate-800 border dark:border-slate-700/50 flex flex-col',
                className
            )}
        >
            {/* ... (CardHeader remains the same) ... */}
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <div className="flex items-center">
                    <Settings2 size={20} className="mr-2.5 text-sky-600 dark:text-sky-500" />
                    <div>
                        <CardTitle className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Call Arguments
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Manage function arguments and link them to placeholders.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-3 sm:p-4 min-h-0">
                <Tabs value={action} onValueChange={setAction} className="flex flex-col flex-1">
                    {/* Disable TabsList if not editable */}
                    <TabsList className="grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
                        <TabsTrigger
                            value={Action.ADD}
                            className="py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-md rounded-md data-[state=active]:text-sky-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isEditable}
                        >
                            <PlusCircle size={16} className="mr-1.5" /> Add/Update
                        </TabsTrigger>
                        <TabsTrigger
                            value={Action.REMOVE}
                            className="py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-slate-900 data-[state=active]:shadow-md rounded-md data-[state=active]:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isEditable}
                        >
                            <MinusCircle size={16} className="mr-1.5" /> Remove
                        </TabsTrigger>
                    </TabsList>

                    {/* Disable content if not editable */}
                    <fieldset disabled={!isEditable} className="flex-1 mt-4 flex flex-col">
                        {/* Content for ADD Tab */}
                        <TabsContent value={Action.ADD} className="flex-1 mt-0">
                            <div className="space-y-4 p-1">
                                {selectCallArgName()}
                                {selectLinkedIdentifier()}
                                <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 pt-2">
                                    <Link2 size={16} className="mr-2 text-sky-500" />
                                    <span>
                                        Links argument{' '}
                                        <b className="text-purple-600 dark:text-purple-400">
                                            {callArgName}
                                        </b>{' '}
                                        to placeholder{' '}
                                        <b className="text-sky-600 dark:text-sky-500">
                                            {linkedIdentifier}
                                        </b>
                                        .
                                    </span>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Content for REMOVE Tab */}
                        <TabsContent value={Action.REMOVE} className="flex-1 mt-0">
                            <div className="space-y-4 p-1">
                                {selectCallArgName()}
                                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                                    Select the call argument name you wish to remove. This will
                                    unlink it from any placeholder.
                                </p>
                            </div>
                        </TabsContent>
                    </fieldset>

                    <div className="mt-auto pt-4">
                        {/* Disable Button if not editable */}
                        <Button
                            onClick={handleAction}
                            className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={
                                isLoading ||
                                !isEditable || // Disable if not editable
                                (action === Action.ADD && availablePlaceholders.length === 0)
                            }
                            title={
                                !isEditable
                                    ? 'Cannot modify call arguments for an immutable question'
                                    : ''
                            }
                        >
                            {/* ... (loading indicator logic remains the same) ... */}
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    {/* SVG spinner */}
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
                                    Processing...
                                </div>
                            ) : action === Action.ADD ? (
                                'Add / Update Argument'
                            ) : (
                                'Remove Argument'
                            )}
                        </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
