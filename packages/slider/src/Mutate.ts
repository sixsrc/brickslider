import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { hasClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public targetClass(targetSlide: HTMLElement, applyTranslate: Function) {
    hasClass(targetSlide, CLASS_VALUES.ACTIVE)
      ? applyTranslate(targetSlide)
      : this.animate(targetSlide, this.keyFrames(0.1), this.options(0))
  }
}
