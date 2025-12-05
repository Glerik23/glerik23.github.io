import { defineConfig } from 'vite';

export default defineConfig({
    // Base path for GitHub Pages (repo name or '/' for user.github.io)
    base: '/',
    server: {
        open: true
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: false,
        // Bundle all CSS into one file
        cssCodeSplit: false,
        // Use esbuild for minification (built-in, fast)
        minify: 'esbuild',
        // Hashed filenames for cache busting
        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]'
            }
        }
    },
    // Optimize deps
    optimizeDeps: {
        include: []
    }
});
