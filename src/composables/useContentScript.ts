export const useContentScript = () => {
  const sendMessage = async (message: unknown) => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    if (!tab.id) throw new Error('Tab id is not defined');
    await chrome.tabs.sendMessage(tab.id, message);
  };

  return { sendMessage };
};
