import { setAttribute } from "../dom/methods/setAttribute";

export function setSliderAttributes(
  element: HTMLElement,
  attributes: Object
): void {
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(element, key, value);
  }
}
