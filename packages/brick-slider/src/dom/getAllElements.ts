export function getAllElements<T extends Element>(
  selector: string,
  parent: Document | Element = document
): NodeListOf<T> {
  return parent.querySelectorAll(selector) as NodeListOf<T>;
}
