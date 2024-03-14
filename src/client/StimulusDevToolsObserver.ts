import type { Controller } from '@hotwired/stimulus';
import {
  ParsedStimulusControllerDefinition,
  ParsedStimulusControllerInstance,
  StimulusControllerDefinition,
  StimulusControllerInstance,
  StimulusControllerTarget,
  StimulusControllerValue,
} from '../types/stimulus.ts';
import {
  _stimulus_createHighlightBox,
  _stimulus_getControllerFromInstance,
  _stimulus_getControllerKeys,
  _stimulus_sendEvent,
} from '@/client/utils.ts';
import { getElementSelectorString } from '@/utils/dom.ts';
import type { ValueController } from '@hotwired/stimulus/dist/types/tests/controllers/value_controller';

type StimulusDevToolsObserverAction = (args?: unknown) => void;

type ControllerWithOutlets = Controller & Record<string, Controller[]>;

export interface StimulusDevToolsObserverInterface {
  updateControllers: StimulusDevToolsObserverAction;
  updateInstanceValues: StimulusDevToolsObserverAction;
}

export class StimulusDevToolsObserver implements StimulusDevToolsObserverInterface {
  controllerInstances: StimulusControllerInstance[] = [];
  lazyControllerIdentifiers = new Set<Controller['identifier']>();

  controllersObserver?: MutationObserver;
  controllerValuesObserver?: MutationObserver;
  controllerTargetsObserver?: MutationObserver;
  controllerOutletsObserver?: MutationObserver;

  controllerInstancesLastIndex = new Map<string, number>();
  controllerTargetElementsLastIndex = new Map<string, number>();
  controllerOutletElementsLastIndex = new Map<string, number>();

  observedControllerValuesInstanceUid?: string;
  observedControllerTargetsInstanceUid?: string;
  observedControllerTargetsAttribute?: string;
  observedControllerOutletsInstanceUid?: string;

  constructor() {
    this.controllersObserver = new MutationObserver(this.onControllersObservation.bind(this));
    this.controllersObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    this.controllerValuesObserver = new MutationObserver(this.onControllerValuesObservation.bind(this));
    this.controllerTargetsObserver = new MutationObserver(this.onControllerTargetsObservation.bind(this));
    this.controllerOutletsObserver = new MutationObserver(this.onControllerOutletsObservation.bind(this));
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
      _stimulus_sendEvent('stimulus-devtools:undetected');
      return;
    }

    this.controllerInstances =
      window.Stimulus?.controllers.map(controller => {
        const isLazyController = !!(controller as Controller & { __stimulusLazyController: unknown })[
          '__stimulusLazyController'
        ];
        if (isLazyController) this.lazyControllerIdentifiers.add(controller.identifier);

        // Create uid and ensure to track controller instances elements
        const uidAttribute = `sd-${controller.identifier}-uid`;
        const lastIndexKey = controller.identifier;

        let index = 0;

        const elementUid = controller.element.getAttribute(uidAttribute);
        const elementIndex = elementUid?.split('-').pop();
        const lastIndex = this.controllerInstancesLastIndex.get(lastIndexKey);

        if (elementIndex) {
          index = parseInt(elementIndex);
          if (!lastIndex || lastIndex < index) this.controllerInstancesLastIndex.set(lastIndexKey, index);
        } else {
          if (typeof lastIndex === 'number') index = lastIndex + 1;
          this.controllerInstancesLastIndex.set(lastIndexKey, index);
        }

        const uid = `${controller.identifier}-${index.toString()}`;
        if (!elementIndex) controller.element.setAttribute(uidAttribute, uid);

        return {
          uid,
          uidSelector: `[${uidAttribute}="${uid}"]`,
          identifier: controller.identifier,
          element: controller.element,
          elementSelector: getElementSelectorString(controller.element),
        } as StimulusControllerInstance;
      }) || [];

    _stimulus_sendEvent('stimulus-devtools:controllers:updated', {
      controllerDefinitions: this.parsedControllerDefinitions,
    });
  }

  updateInstanceValues(args: unknown) {
    const uid = (args as { uid: StimulusControllerInstance['uid'] }).uid;
    if (!uid) return;

    if (!window.Stimulus) return;

    const instance = this.controllerInstances.find(controllerInstance => controllerInstance.uid === uid);
    if (!instance) return;

    const controller = _stimulus_getControllerFromInstance(instance);
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

    // Start or restart observer
    if (this.observedControllerValuesInstanceUid !== uid) {
      this.observedControllerValuesInstanceUid = uid;
      this.controllerValuesObserver?.disconnect();
      this.controllerValuesObserver?.observe(controller.element, {
        attributes: true,
      });
    }

    _stimulus_sendEvent('stimulus-devtools:instance-values:updated', { uid, values });
  }

  updateInstanceTargets(args: unknown) {
    const uid = (args as { uid: StimulusControllerInstance['uid'] }).uid;
    if (!uid) return;

    if (!window.Stimulus) return;

    const instance = this.controllerInstances.find(controllerInstance => controllerInstance.uid === uid);
    if (!instance) return;

    const controller = _stimulus_getControllerFromInstance(instance);
    if (!controller) return;

    const controllerKeys = _stimulus_getControllerKeys(controller);

    const targetNames = controllerKeys
      .filter(k => k.endsWith('Target') && !k.startsWith('has'))
      .map(k => k.slice(0, -6)); // Remove "Target" at the end

    const targets = targetNames.map(targetName => {
      const elements = (controller as Controller & Record<string, unknown>)[`${targetName}Targets`] as Element[];

      const targetElements = elements.map(element => {
        // Create uid and ensure to track target elements
        const uidAttribute = `sd-${controller.identifier}-t-${targetName.toLowerCase()}-uid`;
        const lastIndexKey = `${controller.identifier}-${targetName}`;

        let index = 0;

        const elementUid = element.getAttribute(uidAttribute);
        const elementIndex = elementUid?.split('-').pop();
        const lastIndex = this.controllerTargetElementsLastIndex.get(lastIndexKey);

        if (elementIndex) {
          index = parseInt(elementIndex);
          if (!lastIndex || lastIndex < index) this.controllerTargetElementsLastIndex.set(lastIndexKey, index);
        } else {
          if (typeof lastIndex === 'number') index = lastIndex + 1;
          this.controllerTargetElementsLastIndex.set(lastIndexKey, index);
        }

        const uid = `${targetName}-${index}`;
        if (!elementUid) element.setAttribute(uidAttribute, uid);

        return {
          uid,
          uidSelector: `[${uidAttribute}="${uid}"]`,
          elementSelector: getElementSelectorString(element),
        };
      });

      return {
        name: targetName,
        elements: targetElements,
        htmlAttribute: `${controller.context.schema.targetAttributeForScope(controller.identifier)}="${targetName}"`,
        jsSingular: `this.${targetName}Target`,
        jsPlural: `this.${targetName}Targets`,
        jsExistential: `this.has${targetName[0].toUpperCase() + targetName.slice(1)}Target`,
      } as StimulusControllerTarget;
    });

    // Start or restart observer
    if (this.observedControllerTargetsInstanceUid !== uid) {
      this.observedControllerTargetsInstanceUid = uid;
      this.observedControllerTargetsAttribute = window.Stimulus.schema.targetAttributeForScope(controller.identifier);
      this.controllerTargetsObserver?.disconnect();
      this.controllerTargetsObserver?.observe(controller.element, {
        childList: true,
        subtree: true,
      });
    }

    _stimulus_sendEvent('stimulus-devtools:instance-targets:updated', { uid, targets });
  }

  updateInstanceOutlets(args: unknown) {
    const uid = (args as { uid: StimulusControllerInstance['uid'] }).uid;
    if (!uid) return;

    if (!window.Stimulus) return;

    const instance = this.controllerInstances.find(controllerInstance => controllerInstance.uid === uid);
    if (!instance) return;

    const controller = _stimulus_getControllerFromInstance(instance);
    if (!controller) return;

    const controllerKeys = _stimulus_getControllerKeys(controller);

    const outletNames = controllerKeys
      .filter(k => k.endsWith('Outlet') && !k.startsWith('has'))
      .map(k => k.slice(0, -6)); // Remove "Outlet" at the end

    const outlets = outletNames.map(outletName => {
      const outletReferences = (controller as ControllerWithOutlets)[`${outletName}Outlets`].map(outletController => {
        // Create uid and ensure to track outlet elements
        const uidAttribute = `sd-${controller.identifier}-o-${outletName.toLowerCase()}-uid`;
        const lastIndexKey = `${controller.identifier}-${outletName}`;

        let index = 0;

        const elementUid = outletController.element.getAttribute(uidAttribute);
        const elementIndex = elementUid?.split('-').pop();
        const lastIndex = this.controllerOutletElementsLastIndex.get(lastIndexKey);

        if (elementIndex) {
          index = parseInt(elementIndex);
          if (!lastIndex || lastIndex < index) this.controllerOutletElementsLastIndex.set(lastIndexKey, index);
        } else {
          if (typeof lastIndex === 'number') index = lastIndex + 1;
          this.controllerOutletElementsLastIndex.set(lastIndexKey, index);
        }

        const uid = `${outletName}-${index}`;
        if (!elementUid) outletController.element.setAttribute(uidAttribute, uid);

        return {
          uid,
          uidSelector: `[${uidAttribute}="${uid}"]`,
          identifier: outletController.identifier,
          elementSelector: getElementSelectorString(controller.element),
        };
      });

      return {
        name: outletName,
        selector: controller.outlets.getSelectorForOutletName(outletName),
        references: outletReferences,
        htmlAttribute: `${controller.context.schema.outletAttributeForScope(controller.identifier, outletName)}`,
        jsSingular: `this.${outletName}Outlet`,
        jsPlural: `this.${outletName}Outlets`,
        jsExistential: `this.has${outletName[0].toUpperCase() + outletName.slice(1)}Outlet`,
        jsElementSingular: `this.${outletName}OutletElement`,
        jsElementPlural: `this.${outletName}OutletElements`,
      };
    });

    // Start or restart observer
    if (this.observedControllerOutletsInstanceUid !== uid) {
      this.observedControllerOutletsInstanceUid = uid;
      this.controllerOutletsObserver?.disconnect();
      this.controllerOutletsObserver?.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
    }

    _stimulus_sendEvent('stimulus-devtools:instance-outlets:updated', { uid, outlets });
  }

  highlightElement(args: any) {
    const { selector, title } = args;
    if (!selector) return;

    const highlightedElement = document.querySelector(selector) as HTMLElement;
    if (!highlightedElement) return;

    const highlightBox = _stimulus_createHighlightBox(highlightedElement, title);

    document.body.appendChild(highlightBox);
  }

  stopHighlightElement() {
    const highlightBoxes = document.querySelectorAll('.stimulus-devtools-highlight');
    highlightBoxes.forEach(highlightBoxe => {
      highlightBoxe.remove();
    });
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
    let shouldUpdate = false;
    mutationsList.forEach(mutation => {
      if (mutation.attributeName?.startsWith('data-') && mutation.attributeName?.endsWith('-value')) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) this.updateInstanceValues({ uid: this.observedControllerValuesInstanceUid });
  }

  onControllerTargetsObservation(mutationsList: MutationRecord[]) {
    let shouldUpdate = false;
    mutationsList.forEach(mutation => {
      const nodes = [];
      if (mutation.addedNodes?.length) nodes.push(...Array.from(mutation.addedNodes));
      if (mutation.removedNodes?.length) nodes.push(...Array.from(mutation.removedNodes));
      if (
        nodes.find(node => {
          return !!Array.from((node as HTMLElement).attributes).find(
            attribute => attribute.name === this.observedControllerTargetsAttribute,
          );
        })
      ) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) this.updateInstanceTargets({ uid: this.observedControllerTargetsInstanceUid });
  }

  onControllerOutletsObservation(mutationsList: MutationRecord[]) {
    let shouldUpdate = false;

    mutationsList.forEach(mutation => {
      const nodes = [];
      if (mutation.addedNodes?.length) nodes.push(...Array.from(mutation.addedNodes));
      if (mutation.removedNodes?.length) nodes.push(...Array.from(mutation.removedNodes));
      if (
        nodes.find(node => {
          return !!Array.from((node as HTMLElement).attributes).find(
            attribute => attribute.name === window.Stimulus?.schema.controllerAttribute,
          );
        })
      ) {
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) this.updateInstanceOutlets({ uid: this.observedControllerOutletsInstanceUid });
  }
}
