import { FROM } from "../../action/setCurrentSlide";
import { addClass } from "../../dom/methods/addClass";
import { createNewElement } from "../../dom/methods/createNewElement";
import { setAttribute } from "../../dom/methods/setAttribute";
import { setInnerHTML } from "../../dom/methods/setInnerHTML";
import { ATTRIBUTES, DOM_ELEMENTS, TAGS } from "../../util/constants";

export function createArrowButtons(numOfButtons: number): HTMLElement[] {
  const buttons: HTMLElement[] = [];

  for (let i = 0; i < numOfButtons; i++) {
    const button = createNewElement(TAGS.BUTTON),
      isGreaterThanZero = i === 0;

    setAttribute(
      button,
      ATTRIBUTES.DIRECTION,
      isGreaterThanZero ? FROM.NEXT : FROM.PREV
    );

    addClass([button], DOM_ELEMENTS.BRICK_ARROWS);

    setInnerHTML(button, isGreaterThanZero ? FROM.NEXT : FROM.PREV);

    buttons.push(button);
  }
  return buttons;
}
