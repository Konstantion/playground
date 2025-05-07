import React from 'react';
import {Loader2} from 'lucide-react';

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-[600px]">
            <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        </div>
    );
}
