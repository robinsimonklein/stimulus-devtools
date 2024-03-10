import { sendMessage } from './utils.ts';
import type { Application } from '@hotwired/stimulus';

let detectorInterval: ReturnType<typeof setInterval> | null = null;
let detectorCount = 0;

declare global {
  interface Window {
    Stimulus?: Application;
    __STIMULUS_DEVTOOLS_DETECTED__?: boolean;
  }
}

const detect = () => {
  if (detectorCount++ > 10) {
    if (detectorInterval) clearInterval(detectorInterval);
  }

  if (window['Stimulus']) {
    window['__STIMULUS_DEVTOOLS_DETECTED__'] = true;
    sendMessage('detector', {
      name: 'stimulus-devtools:detected',
    });
    if (detectorInterval) clearInterval(detectorInterval);
  }
};

window.addEventListener('DOMContentLoaded', () => {
  detectorInterval = setInterval(detect, 1000);
  detect();
});
