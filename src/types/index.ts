export type StimulusDevToolsMessage = {
  type: 'event' | 'action';
  name: string;
  args?: Record<string, unknown>;
  data?: Record<string, unknown>;
};
