import { Base } from "@/core/Base"
import { transform } from "@/transition/transform"

export class AnimationFrame extends Base {
  constructor($root: string) {
    super($root)
  }
  public init = (): void => {
    const { currentTranslate, isDragging } = this.store

    transform(this.$root, currentTranslate)

    if (isDragging) requestAnimationFrame(this.init)
  }
}
