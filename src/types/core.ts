import { ElementSelector } from '@/utils/dom';

export type RegisteredControllerInstance = {
  status: 'registered';
  uid: string;
  identifier: string;
  selector: ElementSelector;
  isLazy: boolean;
  // values: ControllerValue[];
};

export type UnregisteredControllerInstance = {
  status: 'unregistered';
  uid: string;
  identifier: string;
  selector: ElementSelector;
};

export type ControllerInstance = RegisteredControllerInstance | UnregisteredControllerInstance;

export type ControllerDefinition = {
  identifier: string;
  instances: ControllerInstance[];
  hasLazyInstance: boolean;
  hasUnregisteredInstance: boolean;
};

// export type ValueType = 'String' | 'Number' | 'Boolean' | 'Object' | 'Array';
//
// export interface ControllerValue {
//   key: string; // ex: "url" ou "index"
//   type: ValueType; // ex: "String"
//   currentValue: any; // La valeur réelle à l'instant T
//   defaultValue?: any; // La valeur par défaut définie dans le static values
// }
