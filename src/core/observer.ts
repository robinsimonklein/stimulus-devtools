import { StimulusApplication } from '@/types/stimulus';
import { ElementRegistry } from '@/core/registry';
import { ControllerInstance } from '@/types/core';
import { getElementSelector } from '@/utils/dom';

export class StimulusObserver {
  private readonly registry = new ElementRegistry();
  private observer: MutationObserver;
  private readonly app: StimulusApplication;
  private onUpdate: (controllers: ControllerInstance[]) => void;

  constructor(app: StimulusApplication, onUpdate: (controllers: ControllerInstance[]) => void) {
    this.app = app;
    this.onUpdate = onUpdate;
    this.observer = new MutationObserver(this.handleMutations.bind(this));
  }

  public start() {
    this.observer.observe(this.app.element || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: [this.app.schema.controllerAttribute || 'data-controller'],
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

    // 1. Clear the lookup map to release references to removed elements
    this.registry.clearActiveMap();

    const controllers: ControllerInstance[] = this.app.controllers.map(controller => {
      const uid = this.registry.getId(controller.element);

      return {
        uid,
        identifier: controller.identifier,
        selector: getElementSelector(controller.element),
        isLazy: !!controller['__stimulusLazyController'],
        // hasValues: Object.keys(controller.values || {}).length > 0,
        // hasClasses: Object.keys(controller.classes || {}).length > 0,
      };
    });

    this.onUpdate(controllers);
  }
}
