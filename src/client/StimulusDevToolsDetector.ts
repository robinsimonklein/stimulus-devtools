import { sendEvent } from './utils.ts';

type StimulusDevToolsDetectorCallback = () => unknown;

export class StimulusDevToolsDetector {
  detectorInterval: ReturnType<typeof setInterval> | null = null;
  detectorCount = 0;

  callback: StimulusDevToolsDetectorCallback;

  constructor(callback: StimulusDevToolsDetectorCallback) {
    this.callback = callback;

    this.detectorInterval = setInterval(this.detect.bind(this), 1000);
    this.detect();

    window.addEventListener('DOMContentLoaded', () => {
      this.detect();
    });
  }

  detect() {
    if (this.detectorCount++ > 10) {
      if (this.detectorInterval) clearInterval(this.detectorInterval);
    }

    if (window['Stimulus']) {
      // Stimulus detected
      window['__STIMULUS_DEVTOOLS_DETECTED__'] = true;
      sendEvent('stimulus-devtools:detected');

      this.callback();
      if (this.detectorInterval) clearInterval(this.detectorInterval);
    }
  }
}
