import { Message } from '@/core/message';
import { TypedMessage, MessageType } from '@/types/message';

export const useMessaging = () => {
  const tabId = browser.devtools.inspectedWindow.tabId;

  const postMessage = <T extends MessageType>(message: Message<T>) => {
    message.tabId = tabId;
    browser.runtime.sendMessage(message);
  };

  const onMessage = (callback: (message: TypedMessage) => void) => {
    browser.runtime.onMessage.addListener((message: unknown) => {
      // Check message signature
      if (!Message.isTypedMessage(message)) return;

      // Only handle messages for this tab
      if (message.tabId !== tabId) return;

      return callback.call(this, message);
    });
  };

  const offMessage = (callback: (message: TypedMessage) => void) => {
    browser.runtime.onMessage.removeListener(callback);
  };

  const onMessageType = <T extends MessageType>(
    type: T,
    callback: (message: Extract<TypedMessage, { type: T }>) => void,
  ) => {
    return onMessage(message => {
      if (Message.is(message, type)) {
        callback(message as Extract<TypedMessage, { type: T }>);
      }
    });
  };

  return { postMessage, onMessage, onMessageType, offMessage };
};
