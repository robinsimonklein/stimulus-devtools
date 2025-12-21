import { Message } from '@/core/message';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  async main() {
    // Listen for messages from page (stimulus-detector) → forward to background
    window.addEventListener('message', async (event: MessageEvent<Message>) => {
      // Only message from current context
      if (event.source !== window) return;

      // Check message signature
      const message = event.data;
      if (typeof message !== 'object' || message === null) return;
      if (message.source !== 'stimulus-devtools') return;

      // Forward message to background
      browser.runtime.sendMessage(message).catch(() => {
        // Ignore errors
      });
    });

    // Listen for messages from background (DevTools) → forward to page
    browser.runtime.onMessage.addListener((message: Message) => {
      // Check message signature
      if (!message || message.source !== 'stimulus-devtools') return;

      // Forward message to page (stimulus-detector)
      window.postMessage(message, '*');
    });

    await injectScript('/stimulus-detector.js');
  },
});
