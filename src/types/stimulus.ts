import type { Controller } from '@hotwired/stimulus';
import type { ValueDescriptor } from '@hotwired/stimulus/dist/types/core/value_properties';

export type StimulusControllerDefinition = {
  identifier: Controller['identifier'];
  instances: StimulusControllerInstance[];
  isLazyController?: boolean;
};

export type ParsedStimulusControllerDefinition = {
  identifier: Controller['identifier'];
  instances: ParsedStimulusControllerInstance[];
  isLazyController?: boolean;
};

export type StimulusControllerInstance = {
  uid: string;
  identifier: Controller['identifier'];
  element: Controller['element'];
  elementSelector: string;
  isLazyController?: boolean;
};

export type ParsedStimulusControllerInstance = Pick<
  StimulusControllerInstance,
  'uid' | 'identifier' | 'elementSelector' | 'isLazyController'
>;

export interface StimulusControllerMember {
  name: string;
  htmlAttribute: string;
  jsSingular: string;
  jsPlural: string;
  jsExistential: string;
}

export interface StimulusControllerValue extends StimulusControllerMember, ValueDescriptor {
  currentValue: unknown;
}

export type StimulusControllerTargetElement = {
  uid: string;
  uidSelector: string;
  elementSelector: string;
};

export interface StimulusControllerTarget extends StimulusControllerMember {
  elements: StimulusControllerTargetElement[];
}
