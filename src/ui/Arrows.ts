import { EVENTS } from "../util/constants";
import { listener } from "../util";
import { createArrowButtons } from "./functions/createArrowButtons";
import { appendArrowButtons } from "./functions/appendArrowButtons";
import { handleClick } from "./functions/handleClick";

export class Arrows {
  public rootSelector: string;

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector;
  }

  public init(): void {
    const { rootSelector } = this,
      createButtons = createArrowButtons(2),
      buttons = appendArrowButtons(createButtons, rootSelector);

    buttons.forEach((button) => {
      const setCurrentSlide = handleClick(button, rootSelector);
      listener(EVENTS.CLICK, button, setCurrentSlide);
    });
  }
}
