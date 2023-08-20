export function getIndexChildren(
  el: Element | null,
  index: number
): Element | null {
  return el?.children.item(index) ?? null;
}
