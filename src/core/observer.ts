import { StimulusApplication } from '@/types/stimulus';
import { ElementRegistry } from '@/core/registry';
import { ControllerInstance, RegisteredControllerInstance, UnregisteredControllerInstance } from '@/types/core';
import { getElementSelector } from '@/utils/dom';

export class StimulusObserver {
  private readonly registry: ElementRegistry;
  private observer: MutationObserver;
  private readonly app: StimulusApplication;
  private onUpdate: (controllers: ControllerInstance[]) => void;

  constructor(
    app: StimulusApplication,
    registry: ElementRegistry,
    onUpdate: (controllers: ControllerInstance[]) => void,
  ) {
    this.app = app;
    this.registry = registry;
    this.onUpdate = onUpdate;
    this.observer = new MutationObserver(this.handleMutations.bind(this));
  }

  get controllerAttr() {
    return this.app.schema.controllerAttribute || 'data-controller';
  }

  public start() {
    this.observer.observe(this.app.element || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [this.controllerAttr],
    });

    // Initial refresh
    this.refresh();
  }

  public stop() {
    this.observer.disconnect();
  }

  private handleMutations(mutations: MutationRecord[]) {
    this.scheduleUpdate();
  }

  private scheduleUpdate() {
    // Refresh on next tick
    setTimeout(() => {
      this.refresh();
    }, 0);
  }

  public refresh() {
    if (!this.app || !this.app.controllers) return;

    // Clear the lookup map to release references to removed elements
    this.registry.clearActiveMap();

    const registeredIdentifiers = new Set<string>();

    const registeredControllers = this.app.controllers.map(controller => {
      const uid = this.registry.getId(controller.element);

      registeredIdentifiers.add(controller.identifier);

      return {
        status: 'registered',
        uid,
        identifier: controller.identifier,
        selector: getElementSelector(controller.element),
        isLazy: !!controller['__stimulusLazyController'],
        // hasValues: Object.keys(controller.values || {}).length > 0,
        // hasClasses: Object.keys(controller.classes || {}).length > 0,
      } satisfies RegisteredControllerInstance;
    });

    // Scan unregistered controllers
    const controllerElements = (this.app.element || document.body).querySelectorAll(`[${this.controllerAttr}]`);

    const unregisteredControllers: UnregisteredControllerInstance[] = [];

    controllerElements.forEach(element => {
      const attr = element.getAttribute(this.controllerAttr);
      if (!attr) return;

      // Separate identifiers in attribute value
      const identifiers = attr.trim().split(/\s+/);

      identifiers.forEach(identifier => {
        if (!registeredIdentifiers.has(identifier)) {
          const uid = this.registry.getId(element);
          const selector = getElementSelector(element);

          unregisteredControllers.push({ status: 'unregistered', uid, identifier, selector });
        }
      });
    });

    this.onUpdate([...registeredControllers, ...unregisteredControllers]);
  }
}
