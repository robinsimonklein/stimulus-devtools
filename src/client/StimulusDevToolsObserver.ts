import type { Controller } from '@hotwired/stimulus';
import {
  ParsedStimulusControllerDefinition,
  ParsedStimulusControllerInstance,
  StimulusControllerDefinition,
  StimulusControllerInstance,
  StimulusControllerValue,
} from '../types/stimulus.ts';
import { getControllerFromInstance, sendEvent } from '@/client/utils.ts';
import { getElementSelectorString } from '@/utils/dom.ts';
import type { ValueController } from '@hotwired/stimulus/dist/types/tests/controllers/value_controller';

type StimulusDevToolsObserverAction = (args?: unknown) => void;

export interface StimulusDevToolsObserverInterface {
  updateControllers: StimulusDevToolsObserverAction;
  updateInstanceValues: StimulusDevToolsObserverAction;
}

export class StimulusDevToolsObserver implements StimulusDevToolsObserverInterface {
  controllerInstances: StimulusControllerInstance[] = [];
  lazyControllerIdentifiers = new Set<Controller['identifier']>();

  controllersObserver?: MutationObserver;
  controllerValuesObserver?: MutationObserver;

  observedControllerValuesInstanceUid?: string;

  constructor() {
    this.controllersObserver = new MutationObserver(this.onControllersObservation.bind(this));
    this.controllersObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.controllerValuesObserver = new MutationObserver(this.onControllerValuesObservation.bind(this));
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

    sendEvent('stimulus-devtools:controllers:updated', { controllerDefinitions: this.parsedControllerDefinitions });
  }

  updateInstanceValues(args: unknown) {
    const uid = (args as { uid: StimulusControllerInstance['uid'] }).uid;

    if (!uid) return;
    if (!window.Stimulus) return;
    const instance = this.controllerInstances.find(controllerInstance => controllerInstance.uid === uid);
    if (!instance) return;

    const controller = getControllerFromInstance(instance);

    if (!controller) return;

    const valueDescriptorMap = (controller as ValueController).valueDescriptorMap;

    const values = Object.values(valueDescriptorMap).map(valueDescriptor => {
      const name = valueDescriptor.name.slice(0, -5); // Remove "Value" at the end
      return {
        name,
        type: valueDescriptor.type,
        key: valueDescriptor.key,
        defaultValue: valueDescriptor.defaultValue,
        currentValue: (controller as Controller & Record<string, unknown>)[valueDescriptor.name],
        htmlAttribute: `data-${controller.identifier}-${valueDescriptor.key}`,
        jsSingular: `this.${name}Value`,
        jsPlural: `this.${name}Values`,
        jsExistential: `this.has${name[0].toUpperCase() + name.slice(1)}Value`,
      } as StimulusControllerValue;
    });

    if (this.observedControllerValuesInstanceUid !== uid) {
      this.observedControllerValuesInstanceUid = uid;
      this.controllerValuesObserver?.disconnect();
      this.controllerValuesObserver?.observe(controller.element, {
        attributes: true,
      });
    }

    sendEvent('stimulus-devtools:instance-values:updated', { uid, values });
  }

  // Observations

  onControllersObservation(mutationsList: MutationRecord[]) {
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

  onControllerValuesObservation(mutationsList: MutationRecord[]) {
    mutationsList.forEach(mutation => {
      if (!(mutation.attributeName?.startsWith('data-') && mutation.attributeName?.endsWith('-value'))) return;
      this.updateInstanceValues({ uid: this.observedControllerValuesInstanceUid });
    });
  }
}
