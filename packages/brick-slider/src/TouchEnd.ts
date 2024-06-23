import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType, State_Keys } from "./State"
import { ANIMATION_OPTIONS } from "./constants"
import {
  addClass,
  animateElement,
  getSliderNodeList,
  getSliderWidth,
  setIndexBypass,
  translate3d
} from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  private sliderWidth: number | undefined
  animation: AnimationFrame
  private slider: Slider
  moveSlider: number

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
    this.animation = new AnimationFrame(this.$root)
    this.moveSlider = 0
  }

  public init = (): void => {
    this.handleTouchMove()
    this.setState(this.mainState())
  }

  private mainState(): Partial<StateType> {
    return {
      isDragging: false,
      isMouseLeave: true,
      isTouch: false,
      endTime: new Date().getMilliseconds()
    }
  }

  private positionState(currentTranslate: number): Partial<StateType> {
    return {
      currentTranslate,
      prevTranslate: currentTranslate
    }
  }

  private handleTouchMove(): void {
    const {
      isMouseLeave,
      isTouch,
      slideIndex,
      currentTranslate,
      prevTranslate,
      startTime,
      endTime
    } = this.store

    this.moveSlider = currentTranslate - prevTranslate

    this.setCancelAnimationFrame()

    if (Math.abs(startTime - endTime) <= 250) {
      // this.state.set({ velocity: 100 })
    }
    console.log()

    if (this.goToNextSlide(this.moveSlider, slideIndex, this.slides)) {
      this.incrementSlideIndex()
    }

    if (this.goToPrevSlide(this.moveSlider, slideIndex)) {
      this.decrementSlideIndex()
    }

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      this.animate()
      this.setState({ isJumpSlide: false })
    }
  }

  private setCancelAnimationFrame(): void {
    const { animationId } = this.store

    if (typeof animationId === "number") cancelAnimationFrame(animationId)
  }

  private incrementSlideIndex(): void {
    const { slideIndex } = this.store
    this.setState({ slideIndex: slideIndex + 1 })
  }

  private decrementSlideIndex(): void {
    const { slideIndex } = this.store
    this.setState({ slideIndex: slideIndex - 1 })
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

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      { transform: translate3d(currentTranslate, 0, 0) },
      {
        transform: translate3d(currentTranslate + this.moveSlider, 0, 0)
      }
    ]
  }
  private options(): AnimationOptions {
    return {
      duration: 0,
      easing: ANIMATION_OPTIONS.EASEOUT
    }
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
