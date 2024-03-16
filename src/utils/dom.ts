export const getElementSelectorString = (element: Element) => {
  if (!element) return '';
  let str = element.localName;
  if (element.id) str += '#' + element.id;
  if (element.classList.length) {
    element.classList.forEach(c => {
      str += '.' + c;
    });
  }
  return str;
};
