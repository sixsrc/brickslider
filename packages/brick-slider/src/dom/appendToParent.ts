export function appendToParent(
  parent: HTMLElement,
  element: HTMLElement
): HTMLElement {
  if (parent) {
    parent.appendChild(element);
  }
  return element;
}
