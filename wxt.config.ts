import { defineConfig } from 'wxt';
import tailwindcss from '@tailwindcss/vite';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-vue'],
  manifest: {
    permissions: ['storage'],
    web_accessible_resources: [
      {
        resources: ['main.js'],
        matches: ['<all_urls>'],
      },
    ],
  },
  webExt: {
    chromiumArgs: [
      '--user-data-dir=./.wxt/chrome-data',
      '--auto-open-devtools-for-tabs',
      '--no-first-run',
      '--hide-crash-restore-bubble',
    ],
    firefoxProfile: './.wxt/firefox-data',
    keepProfileChanges: true,
    startUrls: ['http://localhost:5173'],
  },
  vite: () => ({
    plugins: [tailwindcss()],
  }),
});
