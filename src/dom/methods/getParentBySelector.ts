export function getParentBySelector(
  selector: string,
  element: Element | null
): Element | null {
  if (!element) {
    return null;
  } else if (element.matches(selector)) {
    return element;
  } else {
    return getParentBySelector(selector, element.parentNode as Element | null);
  }
}
