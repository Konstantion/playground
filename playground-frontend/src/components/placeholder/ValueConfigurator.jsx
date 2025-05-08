import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';

export function ValueConfigurator({ type = 'number', initialValue = '', onChange }) {
    const [value, setValue] = useState(initialValue);
    const [error, setError] = useState('');

    useEffect(() => {
        if (type === 'number' && !Number.isInteger(Number(value))) {
            setError('Value must be an integer');
            return;
        }
        setError('');
        const change = {
            type: type === 'number' ? 'i32_value' : 'str_value',
            value: type === 'number' ? Number(value) : value,
        };
        onChange?.(change);
    }, [value]);

    return (
        <Card className="border-none shadow-none">
            <CardHeader>
                <CardTitle>Single Value</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input type="text" value={value} onChange={e => setValue(e.target.value)} />{' '}
                {error && <p className="text-red-500 text-sm">{error}</p>}
            </CardContent>
        </Card>
    );
}
