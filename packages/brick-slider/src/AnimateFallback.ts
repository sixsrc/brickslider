import { BaseSlider } from "./BaseSlider"
import { setStyle } from "./helpers"

export class AnimateFallback extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  protected transform(translate: number) {
    setStyle(this.$children, "transform", String(translate))
  }
}
