import { addClass } from "../../dom/methods/addClass";
import { appendToParent } from "../../dom/methods/appendToParent";
import { createNewElement } from "../../dom/methods/createNewElement";
import { CLASS_VALUES, TAGS } from "../../util/constants";

export function createDots(
  numberOfSlides: number,
  containerDots: HTMLElement
): void {
  for (let i = 0; i < numberOfSlides; i++) {
    const liDots = createNewElement(TAGS.LI);
    appendToParent(containerDots, liDots);
    addClass([liDots], CLASS_VALUES.SLIDER_DOT);
    if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED);
  }
}
