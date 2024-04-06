import BezierEasing from "bezier-easing"
import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { State_Keys } from "./State"
import { EVENTS } from "./constants"
import {
  addClass,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
  listener,
  removeClass,
  setIndexBypass,
  transform,
  waitFor
} from "./helpers"

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  private sliderWidth: number
  animation: AnimationFrame
  private slider: Slider
  limitedMoveSlider: number

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
    this.animation = new AnimationFrame(this.$root)
    this.limitedMoveSlider = 0
  }

  public init = (event: Event): void => {
    this.handleTouchMove(event)
    this.handleTransitionEnd()
    this.setState()
  }

  private handleTouchMove(event: Event) {
    const {
      infinite,
      animationId,
      isMouseLeave,
      isTouch,
      isJumpSlide,
      currentTranslate,
      prevTranslate
    } = this.store

    let moveSlider = currentTranslate - prevTranslate

    let currentIndex = this.store[State_Keys.SlideIndex]

    let positionEquivalent = 0

    if (
      infinite &&
      currentIndex === 1 &&
      !hasClass(getSliderNodeList(this.$root)[4], "active") &&
      isTouch &&
      !isMouseLeave
    ) {
      //positionEquivalent = 2940 - (588 - Math.abs(currentTranslate))

      positionEquivalent = 2352

      currentIndex = 5

      waitFor(0, () => {
        this.state.set({ [State_Keys.IsJumpSlide]: true })
        this.state.set({ [State_Keys.CurrentTranslate]: -positionEquivalent })
        this.state.set({ [State_Keys.PrevTranslate]: -2940 })
        this.state.set({ [State_Keys.SlideIndex]: currentIndex })
      })

      waitFor(20, () => {
        // addClass([this.$children], "transition")
      })
    }

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    this.goToNextSlide(moveSlider, currentIndex, this.slides) &&
      this.incrementSlideIndex()

    this.goToPrevSlide(moveSlider, currentIndex) && this.decrementSlideIndex()

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      if (!positionEquivalent) addClass([this.$children], "transition")
    }

    listener([EVENTS.TRANSITIONEND], this.$children, () => {
      //removeClass(this.$children, "transition")
    })
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
    const isMovedByThreshold = moveSlider < (-this.sliderWidth * 10) / 100
    const isNotLastSlide = currentIndex < element.length - 1
    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold = moveSlider > (this.sliderWidth * 10) / 100
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  private handleTransitionEnd(): void {}

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
    const { slideIndex, slidesPerPage, infinite, isJumpSlide, dots } =
      this.store

    const currentTranslate = slideIndex * -sliderWidth

    this.state.set({
      [State_Keys.CurrentTranslate]: currentTranslate,
      [State_Keys.PrevTranslate]: currentTranslate
    })

    const touchIndex = slideIndex

    console.log("touchIndex", touchIndex)

    this.slider.setSlideTarget({
      from: "touch",
      touchIndex,
      $root
    })

    const index = infinite
      ? setIndexBypass(touchIndex, 6, slidesPerPage)
      : touchIndex

    if (dots) this.slider.updateDots(index, $root)

    // Lógica para calcular a posição equivalente do clone do slider (slider 5)
  }
}
