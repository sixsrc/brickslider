export function getFirstChildren(el: Element | null): Element | null {
  return el?.children.item(0) ?? null;
}
