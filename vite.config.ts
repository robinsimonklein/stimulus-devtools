import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import manifest from './src/manifest';
import { isDev } from './scripts/utils';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    vue(),
    {
      name: 'manifest',
      generateBundle() {
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: manifest,
        });
      },
    },
  ],
  build: {
    watch: isDev ? {} : undefined,
    outDir: 'dist',
    emptyOutDir: false,
    chunkSizeWarningLimit: 2 * 1000,
    rollupOptions: {
      input: {
        devtools: 'devtools.html',
        'devtools-background': 'devtools-background.html',
        bridge: 'src/bridge/index.ts',
        detector: 'src/detector/index.ts',
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
