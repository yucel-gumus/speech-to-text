import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const production = mode === 'production';

  const apiUrl =
    env.VITE_API_URL ||
    process.env.VITE_API_URL ||
    (production ? 'https://api.yucelgumus.dev' : 'http://127.0.0.1:8000');

  const apiKey =
    env.VITE_CLIENT_API_KEY ||
    process.env.VITE_CLIENT_API_KEY ||
    env.VITE_API_KEY ||
    process.env.VITE_API_KEY ||
    '';

  if (production && !apiKey) {
    throw new Error(
      'Production build requires VITE_CLIENT_API_KEY or VITE_API_KEY (GitHub Actions vars/secrets).'
    );
  }

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@src': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(apiUrl),
      'import.meta.env.VITE_CLIENT_API_KEY': JSON.stringify(apiKey),
      'import.meta.env.VITE_API_KEY': JSON.stringify(apiKey),
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