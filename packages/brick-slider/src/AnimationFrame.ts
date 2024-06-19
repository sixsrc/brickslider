import { BaseSlider } from "./BaseSlider"
import { transform } from "./helpers"

export class AnimationFrame extends BaseSlider {
  constructor($root: string) {
    super($root)
  }
  public init = (): void => {
    const { currentTranslate, isDragging} = this.store
    const userDuration = isDragging ? 0 : 600
    const delay = 50
    const actualDuration = userDuration - delay

    this.$children.animate(
      [
        {
          transform: `translate3d(${currentTranslate}px, 0px, 0px)`
        }
      ],
      {
        duration: actualDuration > 0 ? actualDuration : 0,
        easing: "ease-out",
        fill: "forwards",
        delay: delay,
      }
    )

    if (isDragging) requestAnimationFrame(this.init)
  }
}
