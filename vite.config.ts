import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const production = mode === 'production';

  const apiUrl = production
    ? (env.VITE_API_URL || 'https://python-backend-270384591051.europe-west3.run.app')
    : '';

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@src': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
    },
    build: {
      target: 'es2020',
      minify: 'esbuild',
      sourcemap: false,
      outDir: 'dist',
      emptyOutDir: true,
    },
    base: '/speech-to-text/',
  };
});