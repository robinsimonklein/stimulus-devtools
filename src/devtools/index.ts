import { createApp } from 'vue';
import '@/assets/style/style.css';
import DevTools from './DevTools.vue';
import { initHighlighter } from '@/devtools/highlighter.ts';

initHighlighter().then(() => {
  createApp(DevTools).mount('#app');
});
