import { ControllerInstance } from './core';

/**
 * Message payloads for each message type
 */
export type MessagePayloads = {
  INIT: undefined;
  STIMULUS_DETECTED: undefined;
  INSPECT_ELEMENT: { uid: string };
  INSPECT_ELEMENT_READY: { inspectId: string };
  UPDATE: { isDetected: boolean; controllers: ControllerInstance[] };
  REFRESH: undefined;
};

/**
 * Each message has a specific payload type based on its type field
 */
export type TypedMessage<T extends keyof MessagePayloads = keyof MessagePayloads> = {
  [K in T]: {
    source: 'stimulus-devtools';
    type: K;
    tabId?: number;
  } & (MessagePayloads[K] extends undefined ? { data?: never } : { data: MessagePayloads[K] });
}[T];

export type MessageType = keyof MessagePayloads;
