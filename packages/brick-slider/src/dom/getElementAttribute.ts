export function getElementAttribute(
  element: Element | HTMLElement,
  attributeName: string
): string | null {
  return element.getAttribute(attributeName)
}
