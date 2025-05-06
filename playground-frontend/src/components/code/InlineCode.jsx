import React from 'react';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vs} from 'react-syntax-highlighter/dist/esm/styles/prism';

export function InlineCode({code, language = 'javascript'}) {
    return (
        <SyntaxHighlighter
            language={language}
            style={vs}
            wrapLongLines={true}
            PreTag="span"
            customStyle={{
                borderRadius: '0.5rem',
                overflow: 'hidden',
            }}
        >
            {code}
        </SyntaxHighlighter>
    );
}
