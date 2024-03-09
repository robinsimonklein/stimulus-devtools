import {resolve} from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import {manifest} from "./src/manifest";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      vue(),
    {
      name: 'manifest',
      generateBundle(outputOptions, bundle) {
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          // @ts-ignore
          source: manifest
        });
      }
    }
  ],
  build: {
    emptyOutDir: true,
    outDir: 'build',
    rollupOptions: {
      input: {
        'devtools': 'devtools.html',
        'detector': 'src/detector/index.ts',
        'content-script': 'src/contentScript/index.ts',
        'manifest': 'src/manifest.ts' // TODO: find a workaround to watch manifest.ts without including it as input
      },
      output: {
        entryFileNames: 'assets/[name].js'
      },
    },
  }
})
