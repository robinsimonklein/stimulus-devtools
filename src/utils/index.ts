export const inspectElement = (selector: string) => {
  chrome.devtools.inspectedWindow.eval(`inspect(document.querySelector('${selector}'))`);
};
