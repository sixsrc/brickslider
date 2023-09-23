export function getSecondChildren(el: Element | null): Element | null {
  return el?.children.item(1) as Element | null;
}
