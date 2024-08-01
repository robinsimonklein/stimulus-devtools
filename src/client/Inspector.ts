const zIndex = '2147483645';

const titleTemplate: string = `<span style="flex-shrink: 0; font-size: 16px; color: #000">__title__</span>`;
const sizeTemplate: string = `<span style="flex-shrink: 0; font-size: 12px; color: #888">__width__x__height__</span>`;

function createHighlightBox(target: HTMLElement, title?: string) {
  const targetBoundingClientRect = target.getBoundingClientRect();

  const highlightBox = document.createElement('div');
  highlightBox.classList.add('stimulus-devtools-highlight');
  highlightBox.style.position = 'fixed';
  highlightBox.style.zIndex = zIndex;
  highlightBox.style.top = `${targetBoundingClientRect.top}px`;
  highlightBox.style.left = `${targetBoundingClientRect.left}px`;
  highlightBox.style.width = `${targetBoundingClientRect.width}px`;
  highlightBox.style.height = `${targetBoundingClientRect.height}px`;
  highlightBox.style.backgroundColor = 'rgba(119, 232, 185, 0.5)';
  highlightBox.style.borderColor = 'rgba(119, 232, 185, 1)';
  highlightBox.style.borderWidth = '2px';
  highlightBox.style.borderStyle = 'dashed';

  if (title) {
    const titleHeight = 24;
    const arrowHeight = 8;

    const position = targetBoundingClientRect.top > titleHeight + arrowHeight ? 'top' : 'bottom';
    const overflow =
      position === 'top'
        ? targetBoundingClientRect.top > window.innerHeight
        : targetBoundingClientRect.top + targetBoundingClientRect.height < 0;

    const highlightBoxTitle = document.createElement('div');
    highlightBoxTitle.innerHTML =
      titleTemplate.replaceAll('__title__', title) +
      sizeTemplate
        .replaceAll('__width__', parseFloat(targetBoundingClientRect.width.toFixed(2)).toString())
        .replaceAll('__height__', parseFloat(targetBoundingClientRect.height.toFixed(2)).toString());

    highlightBoxTitle.style.display = 'inline-flex';
    highlightBoxTitle.style.position = overflow ? 'fixed' : 'absolute';
    highlightBoxTitle.style.zIndex = zIndex;
    highlightBoxTitle.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif';
    highlightBoxTitle.style.left = overflow ? `${Math.max(targetBoundingClientRect.left, 0)}px` : '0';
    highlightBoxTitle.style.height = `${titleHeight}px`;
    highlightBoxTitle.style.alignItems = 'center';
    highlightBoxTitle.style.columnGap = '4px';
    highlightBoxTitle.style.padding = '0 8px';
    highlightBoxTitle.style.borderRadius = '4px';
    highlightBoxTitle.style.backgroundColor = '#fff';
    highlightBoxTitle.style.boxShadow = '0px 0px 4px 0px rgba(0,0,0,0.2)';

    position === 'top'
      ? (highlightBoxTitle.style.bottom = overflow ? `${arrowHeight}px` : `calc(100% + 1px + ${arrowHeight}px)`)
      : (highlightBoxTitle.style.top = overflow ? `${arrowHeight}px` : `calc(100% + 1px + ${arrowHeight}px)`);

    highlightBox.appendChild(highlightBoxTitle);

    const highlightBoxArrow = document.createElement('span');
    highlightBoxArrow.style.display = 'inline-block';
    highlightBoxArrow.style.position = 'absolute';
    highlightBoxArrow.style.left = '4px';
    highlightBoxArrow.style.zIndex = '+1';
    highlightBoxArrow.style.width = `${arrowHeight}px`;
    highlightBoxArrow.style.height = `${arrowHeight}px`;
    highlightBoxArrow.style.rotate = '45deg';
    highlightBoxArrow.style.backgroundColor = '#fff';
    highlightBoxArrow.style.boxShadow =
      position === 'top' ? '2px 2px 4px 0px rgba(0,0,0,0.1)' : '-2px -2px 4px 0px rgba(0,0,0,0.1)';

    position === 'top'
      ? (highlightBoxArrow.style.bottom = `${arrowHeight / -2}px`)
      : (highlightBoxArrow.style.top = `${arrowHeight / -2}px`);

    highlightBoxTitle.appendChild(highlightBoxArrow);
  }

  return highlightBox;
}

export class Inspector {
  highlightElements(args: { elements: { selector: string; title?: string }[] }) {
    const { elements } = args;
    if (!elements?.length) return;

    elements.forEach(element => {
      const highlightedElement = document.querySelector(element.selector) as HTMLElement;
      if (!highlightedElement) return;

      const highlightBox = createHighlightBox(highlightedElement, element.title);

      document.body.appendChild(highlightBox);
    });
  }

  stopHighlightElements() {
    const highlightBoxes = document.querySelectorAll('.stimulus-devtools-highlight');
    highlightBoxes.forEach(highlightBoxe => {
      highlightBoxe.remove();
    });
  }
}
