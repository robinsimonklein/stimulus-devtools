export const sendEvent = (name: string, payload?: unknown) => {
  window.postMessage({
    key: '_stimulus-devtools-send-message',
    type: 'event',
    name,
    payload,
  });
};
