import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
      '@src': path.resolve(__dirname, './src'),
    }
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: true,
  },
  base: '/speech-to-text/',
});
