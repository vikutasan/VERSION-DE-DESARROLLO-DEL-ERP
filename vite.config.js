import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        plugins: [react()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './apps'),
                '@packages': path.resolve(__dirname, './packages'),
            },
        },
        server: {
            port: parseInt(env.VITE_PORT) || 5173,
            open: false,
            watch: {
                usePolling: true,
            },
        },
    };
});
