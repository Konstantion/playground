import {useEffect, useRef, useState} from "react";
import {Editor} from "@monaco-editor/react";

export default function LockedFirstLineEditor({
                                                  initialCode,
                                                  onChange,
                                                  language,
                                              }) {
    const editorRef = useRef(null);
    const [code, setCode] = useState(initialCode);

    useEffect(() => {
        setCode(initialCode);
        if (editorRef.current) {
            editorRef.current.setValue(initialCode);
        }
    }, [initialCode]);

    function handleMount(editor) {
        editorRef.current = editor;
    }

    function handleChange(value) {
        if (typeof value !== 'string') return;

        const oldLines = code.split('\n');
        const newLines = value.split('\n');

        if (newLines[0] !== oldLines[0]) {
            editorRef.current.setValue(code);
            return;
        }

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
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
            }}
        />
    );
}
