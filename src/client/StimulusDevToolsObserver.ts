import type { Controller } from '@hotwired/stimulus';
import {
  ParsedStimulusControllerDefinition,
  ParsedStimulusControllerInstance,
  StimulusControllerDefinition,
  StimulusControllerInstance,
} from '../types/stimulus.ts';
import { sendEvent } from '@/client/utils.ts';
import { getElementSelectorString } from '@/utils/dom.ts';

export interface StimulusDevToolsObserverInterface {
  updateControllers: () => void;
}

export class StimulusDevToolsObserver implements StimulusDevToolsObserverInterface {
  controllerInstances: StimulusControllerInstance[] = [];
  lazyControllerIdentifiers = new Set<Controller['identifier']>();

  controllersObserver?: MutationObserver;

  constructor() {
    this.controllersObserver = new MutationObserver(this.onControllersObserve.bind(this));
    this.controllersObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Getters

  get controllerDefinitions(): StimulusControllerDefinition[] {
    if (!this.controllerInstances.length) return [];

    const controllerDefinitions: StimulusControllerDefinition[] = [];

    this.controllerInstances.forEach(instance => {
      const matchingDefinition = controllerDefinitions.find(
        definition => definition.identifier === instance.identifier,
      );

      if (matchingDefinition) {
        matchingDefinition.instances.push(instance);
      } else {
        controllerDefinitions.push({
          identifier: instance.identifier,
          instances: [instance],
        });
      }
    });

    controllerDefinitions.forEach(definition => {
      definition.isLazyController = this.lazyControllerIdentifiers.has(definition.identifier);
    });

    return controllerDefinitions;
  }

  get parsedControllerDefinitions(): ParsedStimulusControllerDefinition[] {
    return this.controllerDefinitions.map(definition => ({
      ...definition,
      instances: definition.instances.map(instance => this.parseControllerInstance(instance)),
    }));
  }

  // Parsers

  parseControllerInstance(instance: StimulusControllerInstance): ParsedStimulusControllerInstance {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { element: _, ...parsedInstance } = instance;
    return parsedInstance;
  }

  // Actions

  updateControllers() {
    if (!window.Stimulus) {
      sendEvent('stimulus-devtools:undetected');
      return;
    }

    this.controllerInstances =
      window.Stimulus?.controllers.map((controller, index) => {
        const isLazyController = !!(controller as Controller & { __stimulusLazyController: unknown })[
          '__stimulusLazyController'
        ];
        if (isLazyController) this.lazyControllerIdentifiers.add(controller.identifier);

        return {
          uid: `${controller.identifier}-${index}`,
          identifier: controller.identifier,
          element: controller.element,
          elementSelector: getElementSelectorString(controller.element),
        } as StimulusControllerInstance;
      }) || [];

    window.postMessage({
      key: '_stimulus-devtools-send-message',
      message: {
        name: 'update:controllers',
        scope: 'controllers',
        data: {
          controllerDefinitions: this.parsedControllerDefinitions,
        },
      },
    });
  }

  // Observers
  onControllersObserve(mutationsList: MutationRecord[]) {
    let needsToUpdate = false;

    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // Check for added controllers
        mutation.addedNodes.forEach(node => {
          if (!window.Stimulus) return;
          if (node instanceof Element && node.hasAttribute(window.Stimulus.schema.controllerAttribute)) {
            needsToUpdate = true;
          }
        });

        // Check for removed controllers
        mutation.removedNodes.forEach(node => {
          if (!window.Stimulus) return;
          if (node instanceof Element && node.hasAttribute(window.Stimulus.schema.controllerAttribute)) {
            needsToUpdate = true;
          }
        });
      }
    }

    if (needsToUpdate) this.updateControllers();
  }
}
