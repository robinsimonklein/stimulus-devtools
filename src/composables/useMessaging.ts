import { Message } from '@/core/message';

export const useMessaging = () => {
  const tabId = browser.devtools.inspectedWindow.tabId;

  const postMessage = (message: Message) => {
    message.tabId = tabId;
    browser.runtime.sendMessage(message);
  };

  const onMessage = (callback: (message: Message) => void) => {
    browser.runtime.onMessage.addListener((message: Message) => {
      // Check message signature
      if (!message || message.source !== 'stimulus-devtools') return;

      // Only handle messages for this tab
      if (message.tabId !== tabId) return;

      return callback.call(this, message);
    });
  };

  const offMessage = (callback: (message: Message) => void) => {
    browser.runtime.onMessage.removeListener(callback);
  };

  return { postMessage, onMessage, offMessage };
};
