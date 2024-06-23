import { BaseSlider } from "./BaseSlider"
import { ANIMATION_DELAY, ANIMATION_OPTIONS } from "./constants"
import { animateElement, translate3d } from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

export class AnimationFrame extends BaseSlider {
  constructor($root: string) {
    super($root)
  }
  public init = (): void => {
    this.animate()
    this.setAnimationFrame()
  }

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private setAnimationFrame(): void {
    const { isDragging } = this.store
    if (isDragging) requestAnimationFrame(this.init)
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      {
        transform: translate3d(currentTranslate, 0, 0)
      }
    ]
  }
  private options(): AnimationOptions {
    const { isDragging } = this.store
    const userDuration = isDragging ? 0 : 400
    const actualDuration = userDuration - ANIMATION_DELAY

    return {
      duration: actualDuration > 0 ? actualDuration : 0,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS,
      delay: ANIMATION_DELAY
    }
  }
}

/*this.$children.animate(
      [
        {
          transform: `translate3d(${currentTranslate}px, 0px, 0px)`
        }
      ],
      {
        duration: actualDuration > 0 ? actualDuration : 0,
        easing: "ease-out",
        fill: "forwards",
        delay: delay
      }
    )*/
