import { StimulusControllerInstance } from '@/types/stimulus.ts';
import type { Controller } from '@hotwired/stimulus';

export const _stimulus_sendEvent = (name: string, data?: Record<string, unknown>) => {
  window.postMessage({
    key: '_stimulus-devtools-send-message',
    message: {
      type: 'event',
      name,
      data,
    },
  });
};

export const _stimulus_getControllerFromInstance = (instance: StimulusControllerInstance) => {
  if (!window.Stimulus) return null;
  if (!instance) return null;

  return window.Stimulus.getControllerForElementAndIdentifier(instance.element, instance.identifier);
};

export const _stimulus_getControllerKeys = (controller: Controller) => {
  // Retrieve controller's prototype members
  const controllerPrototypeMembers = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(controller));
  return Object.keys(controllerPrototypeMembers);
};
