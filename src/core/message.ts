import { MessageType, MessagePayloads, TypedMessage } from '@/types/message';

export class Message<T extends MessageType = MessageType> {
  tabId?: number;
  public readonly source = 'stimulus-devtools' as const;
  public type: T;
  public data?: MessagePayloads[T];

  constructor(type: T, ...args: MessagePayloads[T] extends undefined ? [] : [MessagePayloads[T]]) {
    this.type = type;
    if (args.length > 0) {
      this.data = args[0];
    }
  }

  static is<T extends MessageType>(
    message: TypedMessage | Message,
    type: T,
  ): message is Extract<TypedMessage, { type: T }> {
    return message.type === type;
  }

  static isTypedMessage(value: unknown): value is TypedMessage {
    return (
      typeof value === 'object' &&
      value !== null &&
      'source' in value &&
      value.source === 'stimulus-devtools' &&
      'type' in value
    );
  }
}
