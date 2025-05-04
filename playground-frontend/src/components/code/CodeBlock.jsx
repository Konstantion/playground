import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area.js';
import { cn } from '@/lib/utils.js';
import { Highlight, themes } from 'prism-react-renderer';

const theme = themes.vsDark;

export function CodeBlock({ code, language = 'javascript', className }) {
    return (
        <ScrollArea className={cn('rounded-lg border bg-gray-900', className)}>
            <Highlight code={code.trim()} language={language} theme={theme}>
                {({ className: inherited, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                        className={cn(inherited, 'p-4 overflow-auto text-sm')}
                        style={{ ...style, background: 'none' }}
                    >
                        {tokens.map((line, i) => (
                            <div key={i} {...getLineProps({ line, key: i })}>
                                {line.map((token, key) => (
                                    <span key={key} {...getTokenProps({ token, key })} />
                                ))}
                            </div>
                        ))}
                    </pre>
                )}
            </Highlight>
        </ScrollArea>
    );
}
