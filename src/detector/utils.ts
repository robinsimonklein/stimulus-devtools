export function sendMessage(message: any) {
  window.postMessage({
    key: '_stimulus-devtools-send-message',
    message,
  });
}
