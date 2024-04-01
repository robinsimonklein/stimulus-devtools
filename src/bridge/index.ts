function injectClient() {
  // Inject client script in page
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('assets/client.js');
  (document.head || document.body || document.documentElement).appendChild(script);
}

chrome.runtime.onMessage.addListener(message => {
  window.postMessage(message);
});

window.addEventListener(
  'message',
  async event => {
    if (event.data.type === 'stimulus-devtools:event' && event.data.name === 'stimulus-devtools:detected') {
      injectClient();
      return;
    }

    // Transmit events to devtools
    if (event.data.type === 'stimulus-devtools:event') {
      await chrome.runtime.sendMessage(event.data);
      return;
    }
  },
  false,
);
