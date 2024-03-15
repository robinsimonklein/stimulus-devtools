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

export const _stimulus_createHighlightBox = (target: HTMLElement, title?: string) => {
  const targetBoundingClientRect = target.getBoundingClientRect();

  const highlightBox = document.createElement('div');
  highlightBox.classList.add('stimulus-devtools-highlight');
  highlightBox.style.position = 'fixed';
  highlightBox.style.zIndex = '2147483646';
  highlightBox.style.top = `${targetBoundingClientRect.top}px`;
  highlightBox.style.left = `${targetBoundingClientRect.left}px`;
  highlightBox.style.width = `${targetBoundingClientRect.width}px`;
  highlightBox.style.height = `${targetBoundingClientRect.height}px`;
  highlightBox.style.backgroundColor = 'rgba(119, 232, 185, 0.5)';
  highlightBox.style.borderColor = 'rgba(119, 232, 185, 1)';
  highlightBox.style.borderWidth = '1px';
  highlightBox.style.borderStyle = 'dashed';

  if (title) {
    const titleHeight = 16;
    const highlightBoxTitle = document.createElement('span');
    highlightBoxTitle.innerText = title;
    highlightBoxTitle.style.display = 'inline-flex';
    highlightBoxTitle.style.position = 'absolute';
    highlightBoxTitle.style.left = '0';
    highlightBoxTitle.style.height = `${titleHeight}px`;
    highlightBoxTitle.style.alignItems = 'center';
    highlightBoxTitle.style.padding = '0 4px';
    highlightBoxTitle.style.fontSize = '12px';
    highlightBoxTitle.style.color = '#000';
    highlightBoxTitle.style.backgroundColor = 'rgba(119, 232, 185, 1)';

    targetBoundingClientRect.top > 16
      ? (highlightBoxTitle.style.bottom = 'calc(100% + 1px)')
      : (highlightBoxTitle.style.top = 'calc(100% + 1px)');
    highlightBox.appendChild(highlightBoxTitle);
  }

  return highlightBox;
};
