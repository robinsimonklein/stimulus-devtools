import { StimulusDevToolsObserver, StimulusDevToolsObserverInterface } from '@/client/StimulusDevToolsObserver.ts';
import { StimulusDevToolsDetector } from '@/client/StimulusDevToolsDetector.ts';
import { sendEvent } from '@/client/utils.ts';

export class StimulusDevToolsClient {
  detector: StimulusDevToolsDetector;
  observer?: StimulusDevToolsObserver;

  constructor() {
    this.detector = new StimulusDevToolsDetector(this.onDetect.bind(this));

    window.addEventListener('message', this.onMessage.bind(this));

    document.addEventListener('visibilitychange', () => {
      console.log('visibilitychange', document.visibilityState);
      if (document.visibilityState === 'visible' && window.__STIMULUS_DEVTOOLS_DETECTED__) {
        sendEvent('stimulus-devtools:detected');
      }
    });
  }

  onDetect() {
    this.observer = new StimulusDevToolsObserver();
  }

  onMessage(event: MessageEvent) {
    if (event.data.key !== '_stimulus-devtools-send-message') return;

    const message = event.data.message;
    if (!message) return;

    if (message.type === 'event' && message.name === 'stimulus-devtools:tab-changed') {
      this.observer?.updateControllers();
    }

    if (message.action) {
      if (!this.observer) return;

      const action = message.action as keyof StimulusDevToolsObserverInterface;
      if (this.observer[action] && typeof this.observer[action] === 'function') {
        this.observer[action]();
      }
    }
  }
}
