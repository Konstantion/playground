import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs.js';
import {Action, actionStr} from '@/entities/Action.js';
import {Label} from '@/components/ui/label.js';
import {CallArgs, PlaceholderIdentifier} from '@/entities/Placeholder.js';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select.js';
import {Button} from '@/components/ui/button.js';
import {authenticatedReq} from '@/utils/Requester.js';
import {Endpoints} from '@/utils/Endpoints.js';
import {toast} from 'sonner';
import {ErrorType} from '@/utils/ErrorType.js';
import {Routes as RRoutes} from '@/rout/Routes.jsx';
import {sNotEmpty} from '@/utils/ObjectUtils.js';
import {useAuth} from '@/hooks/useAuth.jsx';
import {useNavigate} from 'react-router-dom';

export default function CallArgsConfigurator({ id, question, setQuestion }) {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();
    const [action, setAction] = useState(Action.ADD);
    const [callArg, setCallArg] = useState(CallArgs.A);
    const [identifier, setIdentifier] = useState(PlaceholderIdentifier.P_1);

    const selectCallArg = () => {
        return (
            <>
                <Label>Call Arg Configurator</Label>
                <Select defaultValue={callArg} onValueChange={setCallArg}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select call arg" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(CallArgs).map(callArg => (
                            <SelectItem key={callArg} value={callArg}>
                                {callArg}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </>
        );
    };

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

    const performAction = () => {
        return <Button onClick={handleAction}>Perform Action</Button>;
    };

    const handleAction = async () => {
        const body = {
            action: actionStr(action),
        };

        if (action === Action.REMOVE) {
            body.args = [callArg];
        } else {
            body.callArgs = [
                {
                    identifier: identifier,
                    name: callArg,
                },
            ];
        }

        await authenticatedReq(
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
        <Card>
            <CardHeader>
                <CardTitle>Call Args</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <Tabs className="m-2" defaultValue={action} onValueChange={setAction}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value={Action.ADD}>Add</TabsTrigger>
                        <TabsTrigger value={Action.REMOVE}>Remove</TabsTrigger>
                    </TabsList>
                    <TabsContent value={Action.ADD}>
                        <Card>
                            <CardContent className="flex flex-col gap-4">
                                {selectCallArg()}
                                {selectIdentifier()}
                                {performAction()}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value={Action.REMOVE}>
                        <Card>
                            <CardContent className="flex flex-col gap-4">
                                {selectCallArg()}
                                {performAction()}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
