chrome.runtime.onMessage.addListener(message => {
  window.postMessage({
    key: '_stimulus-devtools-send-message',
    message,
  });
});

window.addEventListener(
  'message',
  async event => {
    if (event.data.key === '_stimulus-devtools-send-message') {
      await chrome.runtime.sendMessage(event.data.message);
    }
  },
  false,
);
