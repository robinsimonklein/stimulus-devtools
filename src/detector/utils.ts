export const sendMessage = (from: 'detector' | 'client', message: any) => {
  window.postMessage({
    key: '_stimulus-devtools-send-message',
    from,
    message,
  });
};
