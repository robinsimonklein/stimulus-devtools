const titleTemplate: string = `<span style="font-size: 16px; color: #000">__title__</span>`;
const sizeTemplate: string = `<span style="font-size: 12px; color: #888">__width__x__height__</span>`;

function createHighlightBox(target: HTMLElement, title?: string) {
  const targetBoundingClientRect = target.getBoundingClientRect();

  const highlightBox = document.createElement('div');
  highlightBox.classList.add('stimulus-devtools-highlight');
  highlightBox.style.position = 'fixed';
  highlightBox.style.zIndex = '2147483646';
  highlightBox.style.top = `${targetBoundingClientRect.top}px`;
  highlightBox.style.left = `${targetBoundingClientRect.left}px`;
  highlightBox.style.width = `${targetBoundingClientRect.width}px`;
  highlightBox.style.height = `${targetBoundingClientRect.height}px`;
  highlightBox.style.backgroundColor = 'rgba(119, 232, 185, 0.5)';
  highlightBox.style.borderColor = 'rgba(119, 232, 185, 1)';
  highlightBox.style.borderWidth = '1px';
  highlightBox.style.borderStyle = 'dashed';

  if (title) {
    const titleHeight = 24;
    const arrowHeight = 8;

    const direction = targetBoundingClientRect.top > titleHeight + arrowHeight ? 'bottom' : 'top';

    const highlightBoxTitle = document.createElement('div');
    highlightBoxTitle.innerHTML =
      titleTemplate.replaceAll('__title__', title) +
      sizeTemplate
        .replaceAll('__width__', parseFloat(targetBoundingClientRect.width.toFixed(2)).toString())
        .replaceAll('__height__', parseFloat(targetBoundingClientRect.height.toFixed(2)).toString());

    highlightBoxTitle.style.display = 'inline-flex';
    highlightBoxTitle.style.position = 'absolute';
    highlightBoxTitle.style.fontFamily = 'ui-sans-serif, system-ui, sans-serif';
    highlightBoxTitle.style.left = '0';
    highlightBoxTitle.style.height = `${titleHeight}px`;
    highlightBoxTitle.style.alignItems = 'center';
    highlightBoxTitle.style.columnGap = '4px';
    highlightBoxTitle.style.padding = '0 8px';
    highlightBoxTitle.style.color = '#000';
    highlightBoxTitle.style.backgroundColor = 'rgba(255, 255, 255, 1)';

    direction === 'bottom'
      ? (highlightBoxTitle.style.bottom = `calc(100% + 1px + ${arrowHeight}px)`)
      : (highlightBoxTitle.style.top = `calc(100% + 1px + ${arrowHeight}px)`);

    highlightBox.appendChild(highlightBoxTitle);

    const highlightBoxArrow = document.createElement('span');
    highlightBoxArrow.style.display = 'inline-block';
    highlightBoxArrow.style.position = 'absolute';
    highlightBoxTitle.style.left = '0';
    highlightBoxArrow.style.width = '0';
    highlightBoxArrow.style.height = '0';
    highlightBoxArrow.style.borderLeft = `${arrowHeight / 2}px solid transparent`;
    highlightBoxArrow.style.borderRight = `${arrowHeight / 2}px solid transparent`;

    if (direction === 'bottom') {
      highlightBoxArrow.style.borderTop = `${arrowHeight}px solid #fff`;
      highlightBoxArrow.style.bottom = `calc(100% + 1px)`;
    } else {
      highlightBoxArrow.style.borderBottom = `${arrowHeight}px solid #fff`;
      highlightBoxArrow.style.top = `calc(100% + 1px)`;
    }

    highlightBox.appendChild(highlightBoxArrow);
  }

  return highlightBox;
}

export class Inspector {
  highlightElement(args: any) {
    const { selector, title } = args;
    if (!selector) return;

    const highlightedElement = document.querySelector(selector) as HTMLElement;
    if (!highlightedElement) return;

    const highlightBox = createHighlightBox(highlightedElement, title);

    document.body.appendChild(highlightBox);
  }

  stopHighlightElement() {
    const highlightBoxes = document.querySelectorAll('.stimulus-devtools-highlight');
    highlightBoxes.forEach(highlightBoxe => {
      highlightBoxe.remove();
    });
  }
}
