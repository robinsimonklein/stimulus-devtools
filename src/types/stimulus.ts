import type { Controller } from '@hotwired/stimulus';

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
  isLazyController?: boolean;
};

export type ParsedStimulusControllerInstance = {
  uid: string;
  identifier: Controller['identifier'];
  isLazyController?: boolean;
};
