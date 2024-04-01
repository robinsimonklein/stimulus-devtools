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
    const titleHeight = 16;
    const highlightBoxTitle = document.createElement('span');
    highlightBoxTitle.innerText = title;
    highlightBoxTitle.style.display = 'inline-flex';
    highlightBoxTitle.style.position = 'absolute';
    highlightBoxTitle.style.left = '0';
    highlightBoxTitle.style.height = `${titleHeight}px`;
    highlightBoxTitle.style.alignItems = 'center';
    highlightBoxTitle.style.padding = '0 4px';
    highlightBoxTitle.style.fontSize = '12px';
    highlightBoxTitle.style.color = '#000';
    highlightBoxTitle.style.backgroundColor = 'rgba(119, 232, 185, 1)';

    targetBoundingClientRect.top > 16
      ? (highlightBoxTitle.style.bottom = 'calc(100% + 1px)')
      : (highlightBoxTitle.style.top = 'calc(100% + 1px)');
    highlightBox.appendChild(highlightBoxTitle);
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
