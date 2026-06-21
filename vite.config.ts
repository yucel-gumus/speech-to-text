import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const production = mode === 'production';

  const bff =
    env.VITE_BFF_URL ||
    process.env.VITE_BFF_URL ||
    (production ? 'https://pages-bff.vercel.app' : 'http://127.0.0.1:3099');

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
        '@src': path.resolve(__dirname, './src'),
      },
    },
    define: {
      'import.meta.env.VITE_BFF_URL': JSON.stringify(bff),
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