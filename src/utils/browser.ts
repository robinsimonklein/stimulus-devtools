export const inspectElement = (inspectId: string) =>
  new Promise((resolve, reject) => {
    browser.devtools.inspectedWindow.eval(
      `(function() {
      const el = document.querySelector('[data-stimulus-devtools-inspect="${inspectId}"]');
      if (el) {
        el.removeAttribute('data-stimulus-devtools-inspect');
        inspect(el);
      }
    })()`,
      (result, error) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );
  });
