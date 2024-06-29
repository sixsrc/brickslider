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
    const { currentTranslate, prevSlideIndex, slideIndex } = this.store

    /* console.log({
      prevSlideIndex,
      slideIndex
    })
*/
    return [this.transformSlide(), { transform: translate3d(currentTranslate) }]
  }

  private options(): AnimationOptions {
    const { isDragging, isJumpSlide } = this.store
    const duration = isDragging || isJumpSlide ? 0 : 400
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

  private shouldFirstSlide(): boolean {
    const { infinite, prevSlideIndex } = this.store

    return infinite && prevSlideIndex === 0
  }

  private shouldLastSlide(): boolean {
    const { infinite, prevSlideIndex, slideIndex, prevTranslate, startPos } =
      this.store

    //  console.log({ prevSlideIndex, prevTranslate, startPos })

    return infinite && prevSlideIndex === 1 && startPos === -1
  }

  private transformSlide() {
    switch (true) {
      case this.shouldFirstSlide():
        return { transform: translate3d(-2352) }
      case this.shouldLastSlide():
        return { transform: translate3d(-588) }
      default:
        return {}
    }
  }
}

/// this.resetPrevSlide()

/*
 private resetPrevSlide() {
    const { prevSlideIndex, slideIndex } = this.store
    const isLastSlide = prevSlideIndex === 5 && slideIndex === 1
    const isFirstSlide = prevSlideIndex == 1 && slideIndex === 0

    if (isFirstSlide || isLastSlide) this.setState(this.resetPrevSlideState())
  }

   private resetPrevSlideState() {
    return {
      prevSlideIndex: null
    }
  }

*/
