import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.js';
import { Action, actionStr } from '@/entities/Action.js';
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

export default function PlaceholderConfigurator({ id, question, setQuestion }) {
    const { auth, logout } = useAuth();
    const [definition, setDefinition] = useState(null);
    const [action, setAction] = useState(Action.ADD);
    const [identifier, setIdentifier] = useState(PlaceholderIdentifier.P_1);
    const [placeholderDefinition, setPlaceholderDefinition] = useState(
        PlaceholderDefinition.Int32RandomOneOf.name
    );
    const navigate = useNavigate();

    const selectIdentifier = () => {
        return (
            <>
                <Label>Placeholder Identifier </Label>
                <Select defaultValue={identifier} onValueChange={setIdentifier}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select identifier" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(PlaceholderIdentifier).map(placeholder => (
                            <SelectItem key={placeholder} value={placeholder}>
                                {placeholder}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </>
        );
    };

    const selectDefinition = () => {
        return (
            <>
                <Label>Placeholder Definition</Label>
                <Select
                    defaultValue={placeholderDefinition}
                    onValueChange={setPlaceholderDefinition}
                >
                    <SelectTrigger className="w-[260px]">
                        <SelectValue placeholder="Select definition" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(PlaceholderDefinition).map(definition => (
                            <SelectItem key={definition.name} value={definition.name}>
                                {definition.desc}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </>
        );
    };

    const definitionConfigurator = () => {
        let component;
        switch (placeholderDefinition) {
            case PlaceholderDefinition.Int32RandomOneOf.name:
                component = (
                    <RandomOneOfConfigurator
                        key={placeholderDefinition}
                        type={'number'}
                        initialOptions={[]}
                        onChange={setDefinition}
                    />
                );
                break;
            case PlaceholderDefinition.StrRandomOneOf.name:
                component = (
                    <RandomOneOfConfigurator
                        key={placeholderDefinition}
                        type={'string'}
                        initialOptions={[]}
                        onChange={setDefinition}
                    />
                );
                break;
            case PlaceholderDefinition.Int32Range.name:
                component = (
                    <I32RangeConfigurator key={placeholderDefinition} onChange={setDefinition} />
                );
                break;
            case PlaceholderDefinition.StrValue.name:
                component = (
                    <ValueConfigurator
                        key={placeholderDefinition}
                        onChange={setDefinition}
                        type={'string'}
                    />
                );
                break;
            case PlaceholderDefinition.Int32Value.name:
                component = (
                    <ValueConfigurator
                        key={placeholderDefinition}
                        onChange={setDefinition}
                        type={'number'}
                    />
                );
                break;
        }

        return component;
    };

    const performAction = () => {
        return <Button onClick={actionClicked}>Perform Action</Button>;
    };

    const actionClicked = () => {
        const body = {
            action: actionStr(action),
        };

        if (action === Action.REMOVE) {
            body.placeholders = [identifier];
        } else {
            const placeholderDefinitions = {};
            placeholderDefinitions[identifier] = definition;
            body.placeholderDefinition = placeholderDefinitions;
        }

        authenticatedReq(
            Endpoints.Questions.Base + `/${id}`,
            'PATCH',
            body,
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
    };

    return (
        <Card className="h-full flex flex-col min-h-0">
            <CardHeader>
                <CardTitle>Placeholders Configuration</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0 p-2">
                <ScrollArea className="flex-1 min-h-0">
                    <Tabs className="m-2" defaultValue={action} onValueChange={setAction}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value={Action.ADD}>Add</TabsTrigger>
                            <TabsTrigger value={Action.REMOVE}>Remove</TabsTrigger>
                        </TabsList>
                        <TabsContent value={Action.ADD}>
                            <Card className="max-h-full px-2">
                                {selectIdentifier()}
                                {selectDefinition()}
                                {definitionConfigurator()}
                                {performAction()}
                            </Card>
                        </TabsContent>
                        <TabsContent className="h-full" value={Action.REMOVE}>
                            <Card className="h-full px-2">
                                {selectIdentifier()}
                                {performAction()}
                            </Card>
                        </TabsContent>
                    </Tabs>
                </ScrollArea>
            </CardContent>
        </Card>
    );
}
