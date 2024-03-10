chrome.tabs.onActivated.addListener(async activeInfo => {
  await chrome.tabs.sendMessage(activeInfo.tabId, {
    type: 'event',
    name: 'stimulus-devtools:tab-changed',
  });
});
