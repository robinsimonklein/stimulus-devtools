import { createApp } from 'vue';
import './style.css';
import DevTools from './DevTools.vue';

chrome.devtools.panels.create('Stimulus', '', '../../devtools.html', function () {
  console.log('devtools panel created');
});

createApp(DevTools).mount('#app');
