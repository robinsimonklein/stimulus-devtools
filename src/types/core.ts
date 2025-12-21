import { ElementSelector } from '@/utils/dom';

export type ControllerInstance = {
  uid: string;
  identifier: string;
  selector: ElementSelector;
  // values: ControllerValue[];
};

export type ControllerDefinition = {
  identifier: string;
  instances: ControllerInstance[];
};

// export type ValueType = 'String' | 'Number' | 'Boolean' | 'Object' | 'Array';
//
// export interface ControllerValue {
//   key: string; // ex: "url" ou "index"
//   type: ValueType; // ex: "String"
//   currentValue: any; // La valeur réelle à l'instant T
//   defaultValue?: any; // La valeur par défaut définie dans le static values
// }
