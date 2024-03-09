import { createApp } from 'vue';
import '@/assets/style/style.css';
import '@/assets/style/vendor/highlight/github.css';
import DevTools from './DevTools.vue';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import css from 'highlight.js/lib/languages/css';
import xml from 'highlight.js/lib/languages/xml';

chrome.devtools.panels.create('Stimulus', '', '../../devtools.html', function () {
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('html', xml);

  createApp(DevTools).mount('#app');
});
