import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '/arc-doom-generator/', // REPLACE THIS with your actual repository name
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/index.ts')
            }
        }
    }
});