import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        // Optimize CSS
        cssCodeSplit: true,
        // Minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true
            }
        },
        // Chunk splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Separate vendor chunks if needed in future
                }
            }
        }
    },
    // Optimize deps
    optimizeDeps: {
        include: []
    }
});
