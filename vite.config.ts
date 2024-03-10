import { defineConfig } from 'vite';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import hotReloadExtension from 'hot-reload-extension-vite';
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
    hotReloadExtension({
      log: true,
      backgroundPath: 'src/background/index.ts',
    }),
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
    minify: false,
    target: ['esnext'],
    rollupOptions: {
      input: {
        devtools: 'devtools.html',
        'devtools-background': 'devtools-background.html',
        client: 'src/client/index.ts',
        background: 'src/background/index.ts',
        'content-script': 'src/contentScript/index.ts',
      },
      output: {
        entryFileNames: 'assets/[name].js',
      },
    },
  },
});
