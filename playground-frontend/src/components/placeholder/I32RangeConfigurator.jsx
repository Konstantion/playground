import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

export function I32RangeConfigurator({ initialStart = 0, initialEnd = 0, onChange }) {
    const [start, setStart] = useState(initialStart);
    const [end, setEnd] = useState(initialEnd);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!Number.isInteger(start) || !Number.isInteger(end)) {
            setError('Start and end must be integers');
            return;
        }
        if (start > end) {
            setError('Start must be <= end');
            return;
        }
        setError('');

        const change = {
            type: 'i32_range',
            start: start,
            end: end,
        };

        onChange?.(change);
    }, [start, end]);

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Integer Range</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <Label className="pb-2">Start</Label>
                        <Input
                            type="number"
                            value={start}
                            onChange={e => setStart(Number(e.target.value))}
                        />
                    </div>
                    <div>
                        <Label className="pb-2">End</Label>
                        <Input
                            type="number"
                            value={end}
                            onChange={e => setEnd(Number(e.target.value))}
                        />
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
        </Card>
    );
}
