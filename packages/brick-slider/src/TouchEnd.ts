import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { State_Keys } from "./State"
import {
  addClass,
  getSliderNodeList,
  getSliderWidth,
  setIndexBypass
} from "./helpers"

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  private sliderWidth: number | undefined
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

  public init = (event: TouchEvent | MouseEvent): void => {
    this.handleTouchMove()
    this.setState(this.mainState())
  }

  private mainState() {
    return {
      [State_Keys.isDragging]: false,
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.IsTouch]: false,
      [State_Keys.EndTime]: new Date().getMilliseconds()
    }
  }

  private positionState(currentTranslate: number) {
    return {
      [State_Keys.CurrentTranslate]: currentTranslate,
      [State_Keys.PrevTranslate]: currentTranslate
    }
  }

  private handleTouchMove() {
    const {
      animationId,
      isMouseLeave,
      isTouch,
      currentTranslate,
      prevTranslate
    } = this.store

    const moveSlider = currentTranslate - prevTranslate

    let currentIndex = this.store[State_Keys.SlideIndex]

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    this.goToNextSlide(moveSlider, currentIndex, this.slides) &&
      this.incrementSlideIndex()

    this.goToPrevSlide(moveSlider, currentIndex) && this.decrementSlideIndex()

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      this.animate(currentTranslate, moveSlider)
      addClass([this.$children], "transition")
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
    const isMovedByThreshold = moveSlider < (-this.sliderWidth! * 40) / 100
    const isNotLastSlide = currentIndex < element.length - 1
    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold = moveSlider > (this.sliderWidth! * 40) / 100
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  private animate(currentTranslate: number, moveSlider: number) {
    this.$children.animate(
      [
        { transform: `translate3d(${currentTranslate}px, 0px, 0px)` },
        {
          transform: `translate3d(${currentTranslate + moveSlider}px, 0px, 0px)`
        }
      ],
      {
        duration: 0,
        easing: "ease"
        // fill: "forwards"
      }
    )
  }

  protected setState(state: any) {
    this.state.set(state)
  }

  private setPosition() {
    const { $root, sliderWidth } = this
    const { slideIndex, slidesPerPage, infinite, dots } = this.store
    const currentTranslate = slideIndex * -sliderWidth!
    const touchIndex = slideIndex

    this.setState(this.positionState(currentTranslate))

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
