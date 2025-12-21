import { v4 as uuidv4 } from 'uuid';

export class ElementRegistry {
  // WeakMap: DOM Element -> String ID
  // Automatically garbage collected when the element is removed from DOM
  private elementToUid = new WeakMap<Element, string>();

  // Regular Map: String ID -> DOM Element
  // Must be cleared before each scan to ensure we don't hold dead references.
  private uidToElement = new Map<string, Element>();

  /**
   * Returns a stable ID for a given DOM element.
   * Generates a new one if it doesn't exist.
   */
  public getId(element: Element): string {
    let uid = this.elementToUid.get(element);

    if (!uid) {
      uid = uuidv4(); // Not using crypto.randomUUID() because it is only available in secure context (https, localhost, ...)
      this.elementToUid.set(element, uid);
    }

    // Refresh the lookup map ensures the element is accessible for this session
    this.uidToElement.set(uid, element);

    return uid;
  }

  /**
   * Retrieves the DOM element for a given ID.
   * Returns undefined if the element is no longer in the active map.
   */
  public getElement(uid: string): Element | undefined {
    return this.uidToElement.get(uid);
  }

  /**
   * Clears the lookup map.
   * Should be called before a full application scan.
   */
  public clearActiveMap() {
    this.uidToElement.clear();
  }
}
