import { Action, MessageType } from '@/enum';

async function sendMessage(message: unknown) {
  try {
    await chrome.tabs?.sendMessage(chrome.devtools.inspectedWindow.tabId, message);
  } catch (error) {
    console.error(error);
  }
}

async function executeAction(name: Action, args?: Record<string, unknown>) {
  await sendMessage({ type: MessageType.Action, name, args });
}

export const useBridge = () => {
  return { executeAction };
};
