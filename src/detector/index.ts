import { sendMessage } from './utils.ts';

let detectorInterval: ReturnType<typeof setInterval> | null = null;
let detectorCount = 0;

declare global {
  interface Window {
    Stimulus?: any;
    __STIMULUS_DEVTOOLS_DETECTED?: boolean;
  }
}

function detect() {
  if (detectorCount++ > 10) {
    if (detectorInterval) clearInterval(detectorInterval);
  }

  if (window['Stimulus']) {
    window['__STIMULUS_DEVTOOLS_DETECTED'] = true;
    sendMessage({
      detected: true,
    });
    if (detectorInterval) clearInterval(detectorInterval);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  detectorInterval = setInterval(detect, 1000);
});
