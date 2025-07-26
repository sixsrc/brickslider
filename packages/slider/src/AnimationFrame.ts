import { BaseSlider } from "./BaseSlider"
import { ANIMATION_OPTIONS, EVENTS, TIMES } from "./constants"
import { translate3d } from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

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
    const { currentTranslate } = this.store

    return [{ transform: translate3d(currentTranslate) }]
  }

  protected options(
    time: number = TIMES.DEFAULT_TRANSITION_TIME
  ): AnimationOptions {
    const {
      isJumpSlide,
      currentEventType,
      infinite,
      currentSlideMovement: mov
    } = this.store
    const isTouchMove = currentEventType === EVENTS.TOUCHMOVE
    const duration = /*isJumpSlide ||*/ isTouchMove ? 0 : time
    const actualDuration = duration > 0 ? duration : 0

    return {
      duration: actualDuration,
      easing: "ease",
      fill: ANIMATION_OPTIONS.FORWARDS
    }
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
