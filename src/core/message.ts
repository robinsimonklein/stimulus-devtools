import { MessageType } from '@/types/message';

export class Message {
  tabId?: number;
  public readonly source = 'stimulus-devtools';
  public type: MessageType;
  public data?: any;

  constructor(type: MessageType, data?: any) {
    this.type = type;
    this.data = data;
  }
}
