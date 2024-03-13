import { StimulusDevToolsObserver, StimulusDevToolsObserverInterface } from '@/client/StimulusDevToolsObserver.ts';
import { StimulusDevToolsDetector } from '@/client/StimulusDevToolsDetector.ts';
import { _stimulus_sendEvent } from '@/client/utils.ts';

export class StimulusDevToolsClient {
  detector: StimulusDevToolsDetector;
  observer?: StimulusDevToolsObserver;

  constructor() {
    this.detector = new StimulusDevToolsDetector(this.onDetect.bind(this));

    window.addEventListener('message', this.onMessage.bind(this));

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && window.__STIMULUS_DEVTOOLS_DETECTED__) {
        _stimulus_sendEvent('stimulus-devtools:detected');
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
      if (this.observer) this.observer.updateControllers();
    }

    if (message.type === 'action') {
      if (!this.observer) return;

      const actionName = message.name as keyof StimulusDevToolsObserverInterface;

      if (this.observer[actionName] && typeof this.observer[actionName] === 'function') {
        this.observer[actionName](message.args);
      }
    }
  }
}
