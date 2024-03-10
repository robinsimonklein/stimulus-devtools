import { StimulusDevToolsClient } from '@/client/StimulusDevToolsClient.ts';

let devtoolsClient: StimulusDevToolsClient | null = null;

window.addEventListener('message', event => {
  if (event.data.key !== '_stimulus-devtools-send-message') return;

  if (event.data?.message?.name === 'stimulus-devtools:detected') {
    if (!devtoolsClient) devtoolsClient = new StimulusDevToolsClient();
  }
});
