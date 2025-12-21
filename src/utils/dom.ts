export interface ElementSelector {
  tag: string;
  id: string;
  classes: string[];
}

export const getElementSelector = (element: Element): ElementSelector => {
  if (!element) return { tag: '', id: '', classes: [] };

  return {
    tag: element.localName,
    id: element.id || '',
    classes: Array.from(element.classList),
  };
};
