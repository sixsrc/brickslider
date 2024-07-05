import { BaseSlider } from "./BaseSlider"
import { ANIMATION_DELAY, ANIMATION_OPTIONS } from "./constants"
import { animateElement, translate3d } from "./helpers"
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
    const found = this.evalSlideConditions()

    // if (found) return found.k

    return [{ transform: translate3d(currentTranslate) }]
  }

  private options(time: number = 400): AnimationOptions {
    const { isDragging, isJumpSlide } = this.store
    const duration = isDragging || isJumpSlide ? 0 : time
    const actualDuration = duration - ANIMATION_DELAY

    return {
      duration: actualDuration > 0 ? actualDuration : 0,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS,
      delay: ANIMATION_DELAY
    }
  }

  protected setState(state: any) {
    this.state.set(state)
  }

  private evalSlideConditions() {
    const found = this.getSlideKeyFrames().find(
      (item: AnimationCondition) => item.c
    )

    return found
  }

  private getKeyFrameForSlide(
    slideIndex: number,
    transform: number
  ): AnimationCondition {
    const { isJumpSlide, prevSlideIndex } = this.store

    return {
      c: isJumpSlide && prevSlideIndex === slideIndex,
      k: [{ transform: translate3d(transform) }]
    }
  }

  private getSlideKeyFrames(): AnimationCondition[] {
    return [
      this.getKeyFrameForSlide(0, -2352),
      this.getKeyFrameForSlide(5, -588)
    ]
  }
}
