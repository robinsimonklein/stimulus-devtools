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

  const POTENTIAL_WINDOW_KEYS = ['Stimulus', 'application'];

  /**
   * Le déclencheur unique. Une fois qu'on a l'app, on arrête de chercher.
   */
  function onStimulusDetected(app: StimulusApplication) {
    if (state.isDetected) return;

    // Validation basique pour s'assurer que c'est bien une app Stimulus
    // (doit avoir une propriété 'controllers' ou 'schema')
    if (!app || typeof app.start !== 'function' || !app.controllers) {
      return;
    }

    state.isDetected = true;

    // Nettoyage si besoin
    if (observer) observer.stop();

    // Démarrage de l'observer
    observer = new StimulusObserver(app, onStimulusObserverUpdate);
    observer.start();

    // Annonce officielle au Content Script
    window.postMessage(new Message('STIMULUS_DETECTED'));
  }

  function onStimulusObserverUpdate(controllers: ControllerInstance[]) {
    state.controllers = controllers;
    window.postMessage(new Message('UPDATE', state));
  }

  /**
   * Try to get Stimulus application instance by using common keys
   */
  function scan() {
    if (state.isDetected) return;

    for (const key of POTENTIAL_WINDOW_KEYS) {
      // @ts-expect-error type
      const candidate = window[key];
      if (candidate) {
        onStimulusDetected(candidate);
        if (state.isDetected) return;
      }
    }
  }

  /**
   * Installe un "piège" sur window.Stimulus et window.application
   * pour être notifié dès que l'assignation se fait.
   */
  function installTraps() {
    POTENTIAL_WINDOW_KEYS.forEach(key => {
      let internalValue: any = undefined;

      try {
        // On vérifie si la propriété est configurable avant de l'écraser
        const descriptor = Object.getOwnPropertyDescriptor(window, key);
        if (descriptor && !descriptor.configurable) return; // Impossible d'intercepter, on se reposera sur le polling

        // @ts-expect-error type
        if (window[key]) {
          // @ts-expect-error type
          internalValue = window[key];
        }

        Object.defineProperty(window, key, {
          configurable: true,
          enumerable: true,
          get() {
            return internalValue;
          },
          set(value) {
            internalValue = value;
            onStimulusDetected(value);
          },
        });
      } catch {
        // Ignore security errors (cross-origin iframe, etc.)
      }
    });
  }

  function startPolling() {
    const interval = 500;
    const maxDuration = 10000;
    let elapsed = 0;

    const timer = setInterval(() => {
      if (state.isDetected) {
        clearInterval(timer);
        return;
      }

      scan();
      elapsed += interval;

      if (elapsed >= maxDuration) {
        clearInterval(timer);
      }
    }, interval);
  }

  // Run detection strategies

  if (document instanceof HTMLDocument) {
    scan();
    installTraps();
    startPolling();
  }

  // Communications

  window.addEventListener('message', (event: MessageEvent<Message>) => {
    if (event.source !== window) return;
    const message = event.data;
    if (!message || message.source !== 'stimulus-devtools') return;

    if (message.type === 'REFRESH' && observer) {
      observer.refresh();
    }
  });
});
