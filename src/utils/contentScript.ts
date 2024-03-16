export const sendMessage = async (message: unknown) => {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  if (!tab?.id) throw new Error('Tab id is not defined');
  try {
    await chrome.tabs.sendMessage(tab.id, message);
  } catch (error) {
    console.error(error);
  }
};

export const executeAction = async (name: string, args?: Record<string, unknown>) => {
  await sendMessage({ type: 'action', name, args });
};
