import { appendToParent } from "../../dom/methods/appendToParent";

export function appendSlider(container: HTMLElement, children: HTMLElement[]) {
  children.forEach((element) => {
    appendToParent(container, element);
  });
}
