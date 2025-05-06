import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle } from 'lucide-react';
import { CodeBlock } from '@/components/code/CodeBlock.jsx';
import { Badge } from '@/components/ui/badge';
import { prettierStr } from '@/entities/Placeholder.js';

export default function QuestionPreview({ question, className }) {
    return (
        <Card className={`${className} flex flex-col min-h-0`}>
            <CardHeader>
                <CardTitle>Question #{question.id}</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 min-h-0">
                <ScrollArea className="flex-1 min-h-0">
                    <div className="flex flex-col space-y-4 p-2">
                        <section>
                            <h4 className="font-medium">Language</h4>
                            <Badge>{question.lang}</Badge>
                        </section>

                        <section>
                            <h4 className="font-medium">Name</h4>
                            <p className="whitespace-pre-wrap">{'askd jnsdkfjn'.repeat(3)}</p>
                        </section>

                        <section>
                            <h4 className="font-medium">Formatted Code</h4>
                            <CodeBlock
                                className="h-40 text-sm"
                                language={question.formatAndCode.format}
                                code={question.formatAndCode.code}
                            />
                        </section>

                        <section>
                            <h4 className="font-medium">Validated</h4>
                            {question.validated ? (
                                <CheckCircle className="text-green-500 w-4 h-4" />
                            ) : (
                                <XCircle className="text-red-500 w-4 h-4" />
                            )}
                        </section>

                        <section className="flex flex-col gap-2">
                            <h4 className="font-medium">Placeholders</h4>
                            {Object.entries(question.placeholderDefinitions).map(([key, value]) => {
                                return (
                                    <Badge key={key} variant={'outline'} className="text-md">
                                        {`${key} → ${prettierStr(value)}`}
                                    </Badge>
                                );
                            })}
                        </section>

                        <section className="flex flex-col gap-2">
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
