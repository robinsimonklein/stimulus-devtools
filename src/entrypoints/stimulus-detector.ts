import type { StimulusApplication } from '@/types/stimulus';
import { StimulusObserver } from '@/core/observer';
import { Message } from '@/core/message';
import { ControllerInstance } from '@/types/core';

interface State {
  isDetected: boolean;
  controllers: ControllerInstance[];
}

export default defineUnlistedScript(() => {
  const state: State = {
    isDetected: false,
    controllers: [],
  };

  let observer: StimulusObserver | null = null;
  let stimulusApp: StimulusApplication | null = null;

  Object.defineProperty(window, 'Stimulus', {
    get: () => stimulusApp,
    set: value => {
      stimulusApp = value;
      if (value && !state.isDetected) {
        onStimulusDetected(value);
      }
    },
    configurable: true,
  });

  // Fallback : si Stimulus est déjà là (ou assigné avant notre script)
  const checkExisting = () => {
    if (window.Stimulus && !state.isDetected) {
      onStimulusDetected(window.Stimulus);
    }
  };
  checkExisting();
  setTimeout(checkExisting, 0);

  // Listen for messages from content script
  window.addEventListener('message', (event: MessageEvent<Message>) => {
    // Only accept messages from same window
    if (event.source !== window) return;

    const message = event.data;
    if (!message || message.source !== 'stimulus-devtools') return;

    // Handle REFRESH message
    if (message.type === 'REFRESH' && observer) {
      observer.refresh();
    }
  });

  function onStimulusObserverUpdate(controllers: ControllerInstance[]) {
    state.controllers = controllers;
    window.postMessage(new Message('UPDATE', state));
  }

  function onStimulusDetected(app: StimulusApplication) {
    if (observer) observer.stop();

    state.isDetected = true;
    stimulusApp = app;

    // Start observing Stimulus app
    observer = new StimulusObserver(app, onStimulusObserverUpdate);
    observer.start();
  }
});
