const prefix = 'stimulus-devtools';

export enum MessageType {
  Event = `${prefix}:event`,
  Action = `${prefix}:action`,
}

export enum MessageEventName {
  Detected = `${prefix}:detected`,
  Undetected = `${prefix}:undetected`,

  ControllersUpdated = `${prefix}:controllers:updated`,
  InstanceValuesUpdated = `${prefix}:instance:values:updated`,
  InstanceTargetsUpdated = `${prefix}:instance:targets:updated`,
  InstanceOutletsUpdated = `${prefix}:instance:outlets:updated`,
  InstanceClassesUpdated = `${prefix}:instance:classes:updated`,
}

export enum Action {
  UpdateControllers = 'updateControllers',
  UpdateInstanceValues = 'updateInstanceValues',
  UpdateInstanceTargets = 'updateInstanceTargets',
  UpdateInstanceOutlets = 'updateInstanceOutlets',
  UpdateInstanceClasses = 'updateInstanceClasses',
  UpdateValue = 'updateValue',

  HighlightElement = 'highlightElement',
  StopHighlightElement = 'stopHighlightElement',
}
