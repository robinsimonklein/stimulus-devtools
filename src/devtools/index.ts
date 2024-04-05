import { createApp } from 'vue';
import '@/devtools/style.css';
import DevTools from './DevTools.vue';
import { initHighlighter } from '@/devtools/highlighter.ts';

initHighlighter().then(() => {
  createApp(DevTools).mount('#app');
});
