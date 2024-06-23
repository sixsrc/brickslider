import { BaseSlider } from "./BaseSlider"
import { ANIMATION_DELAY, ANIMATION_OPTIONS } from "./constants"
import { animateElement, translate3d } from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

export class AnimationFrame extends BaseSlider {
  private userDuration: number
  private delay: number
  private actualDuration: number

  constructor($root: string) {
    super($root)
    this.userDuration = this.store.isDragging ? 0 : 600
    this.delay = ANIMATION_DELAY
    this.actualDuration = this.userDuration - this.delay
  }

  public init = (): void => {
    const { isDragging } = this.store

    animateElement(this.$children, this.keyFrames(), this.options())

    if (isDragging) requestAnimationFrame(this.init)
  }

  private keyFrames(): KeyframeAnimation[] {
    return [
      {
        transform: translate3d(this.store.currentTranslate, 0, 0)
      }
    ]
  }
  private options(): AnimationOptions {
    return {
      duration: this.actualDuration > 0 ? this.actualDuration : 0,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS,
      delay: this.delay
    }
  }
}
