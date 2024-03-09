import { createApp } from 'vue';
import './style.css';
import DevTools from './DevTools.vue';

chrome.devtools.panels.create('Stimulus', '', '../../devtools.html', function () {
  createApp(DevTools).mount('#app');
});


