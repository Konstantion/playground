import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import LockedFirstLineEditor from '@/components/code/LockedFirstLineEditor.jsx';
import {Checkbox} from '@/components/ui/checkbox.js';
import {Label} from '@/components/ui/label.js';
import {Button} from '@/components/ui/button.js';
import {parse} from "@/entities/Placeholder.js";

export default function AddVariant({language, question, onChange}) {
    const buildSignature = () => {
        let signature = 'def signature_helper(';
        question.callArgs.forEach(arg => {
            const {name, identifier} = arg
            const definition = question.placeholderDefinitions[identifier]
            let desc;
            if (!definition) {
                desc = 'undefined'
            } else {
                let type = parse(definition).return

                if (language === 'python') {
                    if (type === 'i32') {
                        type = 'int'
                    }
                }

                desc = type
            }

            if (language === 'python') {
                signature += `${name}: ${desc}, `
            }
        })

        if (language === 'python') {
            return signature.substring(0, signature.length - 2)
                .concat(`) -> str:`)
                .concat(" #do not edit\n")
                .concat(`# Write your code here`)
        } else {
            return `unhandled language ${language}`
        }
    }

    const [signature, setSignature] = useState(buildSignature())

    useEffect(() => {
        setSignature(buildSignature())
    }, [question])

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>Add Variant</CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4 p-4">
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <LockedFirstLineEditor
                        language={language}
                        initialCode={signature}
                        onChange={onChange}
                    />
                </div>
                <div className="flex flex-row">
                    <Label className="mr-2">Is variant correct?</Label>
                    <Checkbox/>
                </div>
                <Button>Add</Button>
            </CardContent>
        </Card>
    );
}
