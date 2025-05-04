import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import monacoEditor from 'vite-plugin-monaco-editor';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss(), monacoEditor({})],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
});
