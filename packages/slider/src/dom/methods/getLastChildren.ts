export function getLastChildren(el: Element | null): Element | null {
  return el?.children.item(el.children.length - 1) ?? null
}
