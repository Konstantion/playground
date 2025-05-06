import React from 'react';
import {ScrollArea} from '@/components/ui/scroll-area.js';
import {cn} from '@/lib/utils.js';
import {Highlight, themes} from 'prism-react-renderer';

const theme = themes.vsDark;

export function CodeBlock({code, language = 'javascript', className, placeholders}) {
    return (
        <ScrollArea className={cn('rounded-lg border bg-gray-900', className)}>
            <Highlight code={code.trim()} language={language} theme={theme}>
                {({className: inherited, style, tokens, getLineProps, getTokenProps}) => (
                    <pre
                        className={cn(inherited, 'p-4 overflow-auto text-sm')}
                        style={{...style, background: 'none'}}
                    >
                        {tokens.map((line, i) => {
                            const {key: _ignoreLineKey, ...lineProps} = getLineProps({
                                line,
                                key: i,
                            });
                            return (
                                <div key={i} {...lineProps}>
                                    {line.map((token, j) => {
                                        const {key: _ignoreTokenKey, ...tokenProps} =
                                            getTokenProps({token, key: j});
                                        const content = token.content;
                                        const isPlaceholder = placeholders.has(content.trim());

                                        return (
                                            <span
                                                key={j}
                                                {...tokenProps}
                                                className={cn(
                                                    tokenProps.className,
                                                    isPlaceholder && 'text-red-500 font-bold'
                                                )}
                                            />
                                        );
                                    })}
                                </div>
                            );
                        })}{' '}
                    </pre>
                )}
            </Highlight>
        </ScrollArea>
    );
}
