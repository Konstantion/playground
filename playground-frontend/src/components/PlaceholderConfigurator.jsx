import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import { Action, actionStr, userStr } from '@/entities/Action.js';
import { PlaceholderDefinition, PlaceholderIdentifier } from '@/entities/Placeholder.js';
import { Label } from '@/components/ui/label.js';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select.js';
import { I32RangeConfigurator } from '@/components/placeholder/I32RangeConfigurator.jsx';
import { RandomOneOfConfigurator } from '@/components/placeholder/RandomOneOfConfigurator.jsx';
import { ValueConfigurator } from '@/components/placeholder/ValueConfigurator.jsx';
import { Button } from '@/components/ui/button.js';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { authenticatedReq } from '@/utils/Requester.js';
import { Endpoints } from '@/utils/Endpoints.js';
import { sNotEmpty } from '@/utils/ObjectUtils.js';
import { toast } from 'sonner';
import { ErrorType } from '@/utils/ErrorType.js';
import { Routes as RRoutes } from '@/rout/Routes.jsx';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { MinusCircle, PlusCircle, SlidersHorizontal } from 'lucide-react';

export default function PlaceholderConfigurator({
    id,
    question,
    setQuestion,
    className,
    isEditable,
}) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const [definition, setDefinition] = useState(null);
    const [action, setAction] = useState(Action.ADD);
    const [identifier, setIdentifier] = useState(PlaceholderIdentifier.P_1);
    const [placeholderDefinitionType, setPlaceholderDefinitionType] = useState(
        PlaceholderDefinition.Int32RandomOneOf.name
    );
    const [isLoading, setIsLoading] = useState(false);

    const selectIdentifier = () => (
        <div className="space-y-1.5">
            <Label
                htmlFor="placeholder-identifier"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                Placeholder Identifier
            </Label>

            <Select value={identifier} onValueChange={setIdentifier} disabled={!isEditable}>
                <SelectTrigger
                    id="placeholder-identifier"
                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <SelectValue placeholder="Select identifier (e.g., P_1)" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:text-slate-200">
                    {Object.values(PlaceholderIdentifier).map(placeholderId => (
                        <SelectItem key={placeholderId} value={placeholderId}>
                            {placeholderId}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const selectDefinitionType = () => (
        <div className="space-y-1.5">
            <Label
                htmlFor="placeholder-definition-type"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
                Definition Type
            </Label>

            <Select
                value={placeholderDefinitionType}
                onValueChange={value => {
                    setPlaceholderDefinitionType(value);
                    setDefinition(null); /* Reset specific config */
                }}
                disabled={!isEditable}
            >
                <SelectTrigger
                    id="placeholder-definition-type"
                    className="w-full dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600 focus:ring-sky-500 focus:border-sky-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <SelectValue placeholder="Select definition type" />
                </SelectTrigger>
                <SelectContent className="dark:bg-slate-700 dark:text-slate-200">
                    {Object.values(PlaceholderDefinition).map(defType => (
                        <SelectItem key={defType.name} value={defType.name}>
                            {defType.desc}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const definitionConfigurator = () => {
        let component;

        const commonProps = {
            key: placeholderDefinitionType,
            onChange: setDefinition,
            isEditable: isEditable,
        };

        switch (placeholderDefinitionType) {
            case PlaceholderDefinition.Int32RandomOneOf.name:
                component = (
                    <RandomOneOfConfigurator {...commonProps} type={'number'} initialOptions={[]} />
                );
                break;
            case PlaceholderDefinition.StrRandomOneOf.name:
                component = (
                    <RandomOneOfConfigurator {...commonProps} type={'string'} initialOptions={[]} />
                );
                break;
            case PlaceholderDefinition.Int32Range.name:
                component = (
                    <I32RangeConfigurator {...commonProps} initialStart={0} initialEnd={10} />
                );
                break;
            case PlaceholderDefinition.StrValue.name:
                component = (
                    <ValueConfigurator {...commonProps} type={'string'} initialValue={''} />
                );
                break;
            case PlaceholderDefinition.Int32Value.name:
                component = <ValueConfigurator {...commonProps} type={'number'} initialValue={0} />;
                break;
            default:
                return (
                    <p className="text-sm text-slate-500 dark:text-slate-400 italic mt-2">
                        Select a definition type to configure.
                    </p>
                );
        }

        return (
            <div className="mt-4 p-4 border border-slate-200 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-800/30">
                <fieldset disabled={!isEditable}>{component}</fieldset>
            </div>
        );
    };

    const handleActionClick = async () => {
        setIsLoading(true);
        const body = { action: actionStr(action) };

        if (action === Action.REMOVE) {
            body.placeholders = [identifier];
        } else {
            if (!definition) {
                toast.warning('Please configure the placeholder details before adding.', {
                    duration: 3000,
                });
                setIsLoading(false);
                return;
            }
            const placeholderDefinitions = {};
            placeholderDefinitions[identifier] = definition;
            body.placeholderDefinition = placeholderDefinitions;
        }

        await authenticatedReq(
            `${Endpoints.Questions.Base}/${id}`,
            'PATCH',
            body,
            auth.accessToken,
            (type, message) => {
                toast.error(message || `Failed to ${action.toLowerCase()} placeholder.`, {
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
                    toast.success(`Placeholder ${identifier} successfully ${userStr(action)}!`, {
                        duration: 3000,
                    });
                }
                if (sNotEmpty(response?.violations)) {
                    Object.entries(response.violations).forEach(([key, value]) => {
                        toast.error(
                            `Validation error for ${key}: ${value.join(' and ').toLowerCase()}.`,
                            { closeButton: true }
                        );
                    });
                } else if (!sNotEmpty(response?.updated) && !sNotEmpty(response?.violations)) {
                    if (action === Action.REMOVE) {
                        toast.info(`Placeholder ${identifier} was not found or already removed.`, {
                            duration: 3000,
                        });
                    } else {
                        toast.success(
                            `Placeholder ${identifier} successfully ${userStr(action)}!`,
                            { duration: 3000 }
                        );
                    }
                }
                setDefinition(null);
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
            <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
                <div className="flex items-center">
                    <SlidersHorizontal
                        size={20}
                        className="mr-2.5 text-sky-600 dark:text-sky-500"
                    />
                    <div>
                        <CardTitle className="text-base sm:text-lg font-semibold text-slate-700 dark:text-slate-200">
                            Placeholder Configuration
                        </CardTitle>
                        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
                            Define or remove dynamic parts of your question.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-3 sm:p-4 min-h-0">
                <Tabs
                    value={action}
                    onValueChange={val => {
                        setAction(val);
                        setDefinition(null);
                    }}
                    className="flex flex-col flex-1"
                >
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

                    <TabsContent value={Action.ADD} className="flex-1 mt-4 overflow-hidden">
                        <ScrollArea
                            className="h-full pr-2"
                            style={{
                                pointerEvents: isEditable ? 'auto' : 'none',
                                opacity: isEditable ? 1 : 0.7,
                            }}
                        >
                            <div className="space-y-4">
                                {selectIdentifier()}
                                {selectDefinitionType()}
                                {definitionConfigurator()}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value={Action.REMOVE} className="flex-1 mt-4 overflow-hidden">
                        <ScrollArea
                            className="h-full pr-2"
                            style={{
                                pointerEvents: isEditable ? 'auto' : 'none',
                                opacity: isEditable ? 1 : 0.7,
                            }}
                        >
                            <div className="space-y-4 p-1">
                                {selectIdentifier()}
                                <p className="text-xs text-slate-500 dark:text-slate-400 pt-2">
                                    Select the placeholder identifier you wish to remove from the
                                    question.
                                </p>
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <div className="mt-auto pt-4">
                        <Button
                            onClick={handleActionClick}
                            className="w-full bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading || !isEditable}
                            title={
                                !isEditable
                                    ? 'Cannot modify placeholders for an immutable question'
                                    : ''
                            }
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
                                    Processing...
                                </div>
                            ) : action === Action.ADD ? (
                                'Add / Update Placeholder'
                            ) : (
                                'Remove Placeholder'
                            )}
                        </Button>
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
}
