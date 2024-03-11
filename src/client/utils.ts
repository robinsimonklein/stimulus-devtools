import { StimulusControllerInstance } from '@/types/stimulus.ts';

export const sendEvent = (name: string, data?: Record<string, unknown>) => {
  window.postMessage({
    key: '_stimulus-devtools-send-message',
    message: {
      type: 'event',
      name,
      data,
    },
  });
};

export const getControllerFromInstance = (instance: StimulusControllerInstance) => {
  if (!window.Stimulus) return null;
  if (!instance) return null;

  return window.Stimulus.getControllerForElementAndIdentifier(instance.element, instance.identifier);
};
