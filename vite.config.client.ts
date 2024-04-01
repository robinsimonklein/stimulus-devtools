import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { isDev } from './scripts/utils';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  publicDir: false,
  build: {
    watch: isDev ? {} : undefined,
    outDir: 'dist',
    emptyOutDir: false,
    target: ['esnext'],
    lib: {
      entry: resolve(__dirname, 'src/client/index.ts'),
      fileName: 'client',
      name: 'StimulusDevToolsClient',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/client.js',
        extend: true,
      },
    },
  },
});
