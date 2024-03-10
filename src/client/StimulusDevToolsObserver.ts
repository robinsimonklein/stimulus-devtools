import type { Application, Controller } from '@hotwired/stimulus';
import {
  ParsedStimulusControllerDefinition,
  ParsedStimulusControllerInstance,
  StimulusControllerDefinition,
  StimulusControllerInstance,
} from '../types/stimulus.ts';

export interface StimulusDevToolsObserverInterface {
  updateControllers: () => void;
}

export class StimulusDevToolsObserver implements StimulusDevToolsObserverInterface {
  application?: Application;

  controllerInstances: StimulusControllerInstance[] = [];
  lazyControllerIdentifiers = new Set<Controller['identifier']>();

  constructor(application?: Application) {
    this.application = application;
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
    this.controllerInstances =
      this.application?.controllers.map((controller, index) => {
        const isLazyController = !!(controller as Controller & { __stimulusLazyController: unknown })[
          '__stimulusLazyController'
        ];
        if (isLazyController) this.lazyControllerIdentifiers.add(controller.identifier);

        return {
          uid: `${controller.identifier}-${index}`,
          identifier: controller.identifier,
          element: controller.element,
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
}
