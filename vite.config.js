import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/arc-doom-generator/',

    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    },

    publicDir: 'data',
    assetsInclude: ['**/*.json']
});