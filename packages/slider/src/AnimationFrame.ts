import { BaseSlider } from "./BaseSlider"
import { ANIMATION_OPTIONS, EVENTS, TIMES } from "./constants"
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

  public init = (): number => {
    const animationId = requestAnimationFrame(() => {
      this.animate(this.$children, this.keyFrames(), this.options())
    })

    return animationId
  }

  protected keyFrames(): KeyframeAnimation[] {
    const found = this.evalSlideConditions()
    const { currentTranslate } = this.store

    if (found) return found.k

    return [{ transform: translate3d(currentTranslate) }]
  }

  protected options(
    time: number = TIMES.DEFAULT_TRANSITION_TIME
  ): AnimationOptions {
    const { isJumpSlide, currentEventType } = this.store
    const isTouchMove = currentEventType === EVENTS.TOUCHMOVE
    const duration = isJumpSlide || isTouchMove ? 0 : time
    const actualDuration = duration > 0 ? duration : 0

    return {
      duration: actualDuration,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS
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

/*

  private getSlideWidth(): number {
    const { spacing, slidesPerPage, slidesPerView, sliderWidth } = this.store

    // Espaço total ocupado pelos gaps
    const totalSpacing = (slidesPerView - 1) * spacing

    // Largura disponível para os slides (subtraindo os gaps)
    const availableWidth = sliderWidth - totalSpacing

    // Largura de cada slide
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth) // Garantir que não seja negativo
  }

*/
