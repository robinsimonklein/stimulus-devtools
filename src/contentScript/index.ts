window.addEventListener(
  'message',
  event => {
    if (event.data.key === '_stimulus-devtools-send-message') {
      chrome.runtime.sendMessage(event.data.message);
    }
  },
  false,
);
