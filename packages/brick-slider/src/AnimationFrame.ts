import { BaseSlider } from "./BaseSlider"
import { ANIMATION_DELAY, ANIMATION_OPTIONS, TIMES } from "./constants"
import { translate3d } from "./helpers"
import {
  AnimationCondition,
  AnimationOptions,
  KeyframeAnimation
} from "./types"

export class AnimationFrame extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public init = (): void => {
    this.animate(this.keyFrames(), this.options())
    this.setAnimationFrame()
  }

  private setAnimationFrame(): void {
    const { isDragging } = this.store

    if (isDragging) requestAnimationFrame(this.init)
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    const found = this.evalSlideConditions()

    if (found) return found.k

    return [{ transform: translate3d(currentTranslate) }]
  }

  protected options(
    time: number = TIMES.DEFAULT_TRANSITION_TIME
  ): AnimationOptions {
    const { isDragging, isJumpSlide } = this.store
    const duration = /*isDragging ||*/ isJumpSlide ? 0 : time
    const actualDuration = duration - ANIMATION_DELAY

    return {
      duration: actualDuration > 0 ? actualDuration : 0,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS,
      delay: ANIMATION_DELAY
    }
  }

  private evalSlideConditions() {
    const found = this.foundSlideKeyFrame().find(
      (item: AnimationCondition) => item.c
    )

    return found
  }

  private setSlideKeyFrame(
    slideIndex: number,
    transform: number
  ): AnimationCondition {
    const { isJumpSlide, prevSlideIndex } = this.store

    return {
      c: isJumpSlide && prevSlideIndex === slideIndex,
      k: [{ transform: translate3d(transform) }]
    }
  }

  private foundSlideKeyFrame(): AnimationCondition[] {
    const { childrenCount } = this
    const penultIndex = this.calcTranslate(childrenCount - 2)
    const secondIndex = this.calcTranslate(1)

    return [
      this.setSlideKeyFrame(0, penultIndex),
      this.setSlideKeyFrame(childrenCount - 1, secondIndex)
    ]
  }
}
