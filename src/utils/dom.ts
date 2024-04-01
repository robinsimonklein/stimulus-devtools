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

export const placeCursorAtEnd = (element: HTMLElement) => {
  const range = document.createRange();
  const sel = window.getSelection();
  range.setStart(element.childNodes[0], element.innerText?.length);
  range.collapse(true);
  sel?.removeAllRanges();
  sel?.addRange(range);
};
