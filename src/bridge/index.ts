import { MessageKey } from '@/enum';

function injectClient() {
  // Inject client script in page
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('assets/client.js');
  (document.head || document.body || document.documentElement).appendChild(script);
}

chrome.runtime.onMessage.addListener(message => {
  window.postMessage({
    key: MessageKey.Message,
    message,
  });
});

window.addEventListener(
  'message',
  async event => {
    if (event.data.key === MessageKey.Detected) {
      injectClient();
      return;
    }

    // Transmit message to devtools
    if (event.data.key === MessageKey.Message) {
      await chrome.runtime.sendMessage(event.data.message);
      return;
    }
  },
  false,
);
