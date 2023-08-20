import { getRootSelector } from "../../core/functions/getRootSelector";
import { prependChild } from "../../dom/methods/prependChild";

export function appendArrowButtons(buttons: HTMLElement[], selector: string) {
  const rootSelector = getRootSelector(selector);
  buttons.forEach((button) => {
    prependChild(rootSelector, button);
  });

  return buttons;
}
