import { BaseSlider } from "./BaseSlider"
import { transform } from "./helpers"

export class AnimationFrame extends BaseSlider {
  constructor($root: string) {
    super($root)
  }
  public init = (): void => {
    const { currentTranslate, isDragging } = this.store

    transform(this.$root, currentTranslate)

    if (isDragging) requestAnimationFrame(this.init)
  }
}
