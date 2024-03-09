import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import { manifest } from './src/manifest';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwind(), autoprefixer()],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
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
    emptyOutDir: true,
    outDir: 'build',
    rollupOptions: {
      input: {
        devtools: 'devtools.html',
        detector: 'src/detector/index.ts',
        'content-script': 'src/contentScript/index.ts',
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
