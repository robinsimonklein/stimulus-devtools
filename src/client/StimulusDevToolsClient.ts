import type { Application } from '@hotwired/stimulus';
import { StimulusDevToolsObserver, StimulusDevToolsObserverInterface } from '@/client/StimulusDevToolsObserver.ts';

export class StimulusDevToolsClient {
  application?: Application;
  observer: StimulusDevToolsObserver;

  constructor() {
    this.application = window.Stimulus;
    this.observer = new StimulusDevToolsObserver(this.application);

    window.addEventListener('message', this.onMessage.bind(this));
  }

  onMessage(event: MessageEvent) {
    if (event.data.key !== '_stimulus-devtools-send-message') return;

    const message = event.data.message;
    if (!message) return;

    if (message.action) {
      const action = message.action as keyof StimulusDevToolsObserverInterface;
      if (this.observer[action] && typeof this.observer[action] === 'function') {
        this.observer[action]();
      }
    }
  }
}
