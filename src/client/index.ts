import { StimulusDevToolsClient } from '@/client/StimulusDevToolsClient.ts';
import type { Application } from '@hotwired/stimulus';

declare global {
  interface Window {
    Stimulus?: Application;
    __STIMULUS_DEVTOOLS_DETECTED__?: boolean;
  }
}

new StimulusDevToolsClient();
