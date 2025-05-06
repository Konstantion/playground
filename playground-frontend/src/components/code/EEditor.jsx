import {useRef, useState} from 'react';
import {Editor} from '@monaco-editor/react';

export default function EEditor({initialCode, onChange, language, editable}) {
    const editorRef = useRef(null);
    const [code, setCode] = useState(initialCode);

    function handleMount(editor) {
        editorRef.current = editor;
    }

    function handleChange(value) {
        if (typeof value !== 'string') return;

        setCode(value);
        onChange?.(value);
    }

    return (
        <Editor
            height="300px"
            defaultLanguage={language}
            value={code}
            onMount={handleMount}
            onChange={handleChange}
            options={{
                minimap: {enabled: false},
                scrollBeyondLastLine: false,
                readOnly: !editable,
            }}
        />
    );
}
