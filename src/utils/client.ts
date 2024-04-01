import { StimulusControllerInstance } from '@/types/stimulus.ts';
import type { Controller } from '@hotwired/stimulus';
import { MessageType } from '@/enum';

export const sendEvent = (name: string, data?: Record<string, unknown>) => {
  window.postMessage({
    type: MessageType.Event,
    name,
    data,
  });
};

export const getControllerFromInstance = (instance: StimulusControllerInstance) => {
  if (!window.Stimulus) return null;
  if (!instance) return null;

  return window.Stimulus.getControllerForElementAndIdentifier(instance.element, instance.identifier);
};

export const getControllerKeys = (controller: Controller) => {
  // Retrieve controller's prototype members
  const controllerPrototypeMembers = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(controller));
  return Object.keys(controllerPrototypeMembers);
};
