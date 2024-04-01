import { MessageType } from '@/enum';

export type StimulusDevToolsMessage = {
  type: MessageType;
  name: string;
  args?: Record<string, unknown>;
  data?: Record<string, unknown>;
};
