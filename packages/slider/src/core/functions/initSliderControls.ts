/*export function initSliderControls(...classes: { init: () => void }[]): void {
  for (let i = 0; i < classes.length; i++) {
    classes[i].init();
  }
}*/

import { Touch } from "../../event/Touch";
import { Arrows } from "../../ui/Arrows";
import { Dots } from "../../ui/Dots";

export function initSliderControls(
  this: any,
  rootSelector: string,
  options: any
): void {
  const { dots, arrows, touch } = options || {};
  if (dots) {
    new Dots(rootSelector).init();
  }

  if (arrows) {
    new Arrows(rootSelector).init();
  }

  if (touch) {
    new Touch(rootSelector).init();
  }
}
