export const sendMessage = async (message: unknown) => {
  try {
    await chrome.tabs?.sendMessage(chrome.devtools.inspectedWindow.tabId, message);
  } catch (error) {
    console.error(error);
  }
};

export const executeAction = async (name: string, args?: Record<string, unknown>) => {
  await sendMessage({ type: 'action', name, args });
};
