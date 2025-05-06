import React, {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Separator} from '@/components/ui/separator';

export function RandomOneOfConfigurator({type = 'number', initialOptions = [], onChange}) {
    const [options, setOptions] = useState(initialOptions);
    const [error, setError] = useState('');
    const [draft, setDraft] = useState('');

    function addOption() {
        if (!draft) {
            setError('Option cannot be empty');
            return;
        }

        if (type === 'number' && !Number.isInteger(Number(draft))) {
            setError('Option must be an integer');
            return;
        }

        const updated = [...options, type === 'number' ? Number(draft) : draft];
        setOptions(prev => updated);
        setDraft('');
        setError('');

        if (updated.length !== 0) {
            const change = {
                options: [...updated],
            };

            if (type === 'number') {
                change.type = 'i32_random_one_of';
            } else {
                change.type = 'str_random_one_of';
            }

            onChange?.(change);
        } else {
            onChange?.(null);
        }
    }

    function removeOption(idx) {
        const next = options.filter((_, i) => i !== idx);
        setOptions(next);
        onChange?.(next);
    }

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Random One Of</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex space-x-2">
                    <Input
                        placeholder={type === 'number' ? 'e.g. 42' : 'e.g. hello'}
                        value={draft}
                        onChange={e => setDraft(e.target.value)}
                    />
                    <Button onClick={addOption}>Add</Button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Separator/>
                {options.length === 0 ? (
                    <p className="text-gray-500">No options yet</p>
                ) : (
                    <ul className="space-y-2 max-h-20 overflow-auto">
                        {options.map((opt, i) => (
                            <li key={i} className="flex justify-between items-center">
                                <span>{String(opt)}</span>
                                <Button variant="ghost" size="icon" onClick={() => removeOption(i)}>
                                    &times;
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}
