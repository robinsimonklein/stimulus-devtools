/**
 * TypeScript interfaces for Stimulus framework
 * These types are based on the public API of @hotwired/stimulus
 * and are version-independent to support multiple Stimulus versions.
 */

export interface StimulusApplication {
  /**
   * Register a controller with the application
   */
  register(identifier: string, controllerConstructor: unknown): void;

  /**
   * Load controller definitions
   */
  load?(definitions: unknown[]): void;

  /**
   * The schema defines data attributes
   */
  schema: StimulusSchema;

  element: Element;

  controllers: StimulusController[];
}

export interface StimulusController {
  identifier: string;
  element: Element;
  context: StimulusControllerContext;
}

export interface StimulusControllerContext {
  module: StimulusModule;
}

export interface StimulusModule {
  controllerConstructor: () => void;
}

export interface StimulusSchema {
  /**
   * Attribute name for controllers (default: "data-controller")
   */
  controllerAttribute: string;

  /**
   * Attribute name for actions (default: "data-action")
   */
  actionAttribute: string;

  /**
   * Attribute name for targets (default: "data-{identifier}-target")
   */
  targetAttribute: string;
}

/**
 * Global window interface extensions
 */
declare global {
  interface Window {
    Stimulus?: StimulusApplication;
    application?: StimulusApplication;
  }
}
