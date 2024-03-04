import { setAttribute } from "../dom/setAttribute"

export function setAttributes(element: HTMLElement, attributes: Object): void {
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(element, key, value)
  }
}
