import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CheckCircle, XCircle} from 'lucide-react';

export default function VariantsConfigurator({correct, incorrect}) {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Variants</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto space-y-4">
                <section>
                    <h4 className="font-medium mb-2">Correct</h4>
                    {correct.length === 0 ? (
                        <p className="text-gray-500">—</p>
                    ) : (
                        correct.map(v => (
                            <div key={v.id} className="flex items-start gap-2 mb-2">
                                <CheckCircle className="text-green-500 w-5 h-5 mt-1"/>
                                <pre className="whitespace-pre-wrap text-sm bg-green-50 p-2 rounded flex-1">
                                    {v.code.code}
                                </pre>
                            </div>
                        ))
                    )}
                </section>

                <section>
                    <h4 className="font-medium mb-2">Incorrect</h4>
                    {incorrect.length === 0 ? (
                        <p className="text-gray-500">—</p>
                    ) : (
                        incorrect.map(v => (
                            <div key={v.id} className="flex items-start gap-2 mb-2">
                                <XCircle className="text-red-500 w-5 h-5 mt-1"/>
                                <pre className="whitespace-pre-wrap text-sm bg-red-50 p-2 rounded flex-1">
                                    {v.code.code}
                                </pre>
                            </div>
                        ))
                    )}
                </section>
            </CardContent>
        </Card>
    );
}
