import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { State_Keys } from "./State"
import { EVENTS, STYLES, TRANSITIONS } from "./constants"
import {
  getSliderNodeList,
  getSliderWidth,
  listener,
  setIndexBypass,
  setStyle,
  waitFor
} from "./helpers"

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  private sliderWidth: number
  animation: AnimationFrame
  private slider: Slider

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    this.handleTouchMove(event)
    this.handleTransitionEnd()
    this.setState()
  }

  private handleTouchMove(event: Event) {
    const {
      animationId,
      isMouseLeave,
      isTouch,
      currentTranslate: updatedCurrentTranslate,
      prevTranslate: updatedPrevTranslate
    } = this.store

    const moveSlider = updatedCurrentTranslate - updatedPrevTranslate

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    let currentIndex = this.store[State_Keys.SlideIndex]

    this.goToNextSlide(moveSlider, currentIndex, this.slides) &&
      this.incrementSlideIndex()

    this.goToPrevSlide(moveSlider, currentIndex) && this.decrementSlideIndex()

    if (!isMouseLeave && isTouch) {
      setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
      this.setPosition()
    }
  }

  private incrementSlideIndex(): void {
    this.state.set({ [State_Keys.SlideIndex]: this.store.slideIndex + 1 })
  }

  private decrementSlideIndex(): void {
    this.state.set({ [State_Keys.SlideIndex]: this.store.slideIndex - 1 })
  }

  private goToNextSlide(
    moveSlider: number,
    currentIndex: number,
    element: HTMLElement[]
  ): boolean {
    const isMovedByThreshold = moveSlider < -588 / 2 // -40
    const isNotLastSlide = currentIndex < element.length - 1
    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold = moveSlider > 588 / 2 // 40
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  protected handleTransitionEnd(): void {
    listener([EVENTS.TRANSITIONEND], this.$children, () => {
      waitFor(50, () => setStyle(this.$children, STYLES.TRANSITION, ""))
    })
  }

  protected setState() {
    this.state.set({
      [State_Keys.isDragging]: false,
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.IsTouch]: false,
      [State_Keys.EndTime]: new Date().getMilliseconds()
    })
  }

  private setPosition() {
    const { $root, sliderWidth } = this
    const { slideIndex, slidesPerPage, infinite, dots } = this.store

    const currentTranslate = slideIndex * -sliderWidth

    this.state.set({
      [State_Keys.CurrentTranslate]: currentTranslate,
      [State_Keys.PrevTranslate]: currentTranslate
    })

    const touchIndex = slideIndex

    this.slider.setSlideTarget({
      from: "touch",
      touchIndex,
      $root
    })

    const index = infinite
      ? setIndexBypass(touchIndex, 6, slidesPerPage)
      : touchIndex

    if (dots) this.slider.updateDots(index, $root)
  }
}
