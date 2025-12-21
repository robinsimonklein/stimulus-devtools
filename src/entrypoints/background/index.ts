import { Message } from '@/core/message';

export default defineBackground(() => {
  browser.runtime.onMessage.addListener((message: Message, sender) => {
    // Check message signature
    if (!message || message.source !== 'stimulus-devtools') return;

    // Messages from DevTools Panel → forward to Content Script
    if (!sender.tab && message.tabId) {
      browser.tabs.sendMessage(message.tabId, message).catch(() => {
        // Ignore errors (tab might not have content script loaded)
      });
      return;
    }

    // Messages from Content Script → broadcast to all contexts (DevTools will filter by tabId)
    if (sender.tab?.id) {
      message.tabId = sender.tab.id;
      browser.runtime.sendMessage(message).catch(() => {
        // Ignore errors (no listeners)
      });
      return;
    }
  });
});
