import type { Application } from '@hotwired/stimulus';
import { StimulusDevToolsObserver, StimulusDevToolsObserverInterface } from '@/client/StimulusDevToolsObserver.ts';
import { MessageKey } from '@/enum';

declare global {
  interface Window {
    Stimulus?: Application;
    __STIMULUS_DEVTOOLS_DETECTED__?: boolean;
  }
}

const observer = new StimulusDevToolsObserver();

window.addEventListener('message', e => {
  if (e.data.key === MessageKey.Message) {
    const { message } = e.data;
    if (!message) return;

    if (message.type === 'action') {
      if (!observer) return;

      const actionName = message.name as keyof StimulusDevToolsObserverInterface;

      if (observer[actionName] && typeof observer[actionName] === 'function') {
        observer[actionName](message.args);
      }
    }
  }
});
