import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { ANIMATION_OPTIONS, TOUCH_LIMIT } from "./constants"
import {
  animateElement,
  getSliderNodeList,
  setIndexBypass,
  translate3d
} from "./helpers"
import {
  AnimationOptions,
  KeyframeAnimation,
  UpdateSlideIndexType
} from "./types"

type MainStateTouchEnd = Pick<
  StateType,
  "isDragging" | "isMouseLeave" | "isTouch" | "endTime"
>

type IncrementOrDecrementSlide = Pick<StateType, "slideIndex">

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  animation: AnimationFrame
  private slider: Slider
  private moveSlider: number

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.animation = new AnimationFrame(this.$root)
    this.moveSlider = 0
  }

  public init = (): void => {
    this.handleTouchMove()
    this.setState(this.mainState())
  }

  private mainState(): Partial<MainStateTouchEnd> {
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
      prevTranslate
    } = this.store

    this.moveSlider = currentTranslate - prevTranslate

    this.setCancelAnimationFrame()

    this.setState(this.prevSlideState(slideIndex))

    if (this.goToNextSlide(this.moveSlider, slideIndex, this.slides)) {
      this.updateSlideIndex("increment")
    }

    if (this.goToPrevSlide(this.moveSlider, slideIndex)) {
      this.updateSlideIndex("decrement")
    }

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      this.animate()
      this.setState(this.jumpSlideState())
    }
  }

  private setCancelAnimationFrame(): void {
    const { animationId } = this.store

    if (typeof animationId === "number") cancelAnimationFrame(animationId)
  }

  private updateSlideIndex(action: UpdateSlideIndexType): void {
    const objState = this.shouldIncrementOrDecrement(action)

    this.setState(objState)
  }

  private shouldIncrementOrDecrement(
    action: UpdateSlideIndexType
  ): Partial<IncrementOrDecrementSlide> {
    const { slideIndex } = this.store

    return action === "increment"
      ? { slideIndex: slideIndex + 1 }
      : { slideIndex: slideIndex - 1 }
  }

  private goToNextSlide(
    moveSlider: number,
    currentIndex: number,
    element: HTMLElement[]
  ): boolean {
    const isMovedByThreshold =
      moveSlider < (-this.sliderWidth! * TOUCH_LIMIT) / 100
    const isNotLastSlide = currentIndex < element.length - 1

    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold =
      moveSlider > (this.sliderWidth! * TOUCH_LIMIT) / 100
    const isNotFirstSlide = currentIndex > 0

    return isMovedByThreshold && isNotFirstSlide
  }

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    const { moveSlider } = this

    return [
      { transform: translate3d(currentTranslate) },
      {
        transform: translate3d(currentTranslate + moveSlider)
      }
    ]
  }
  private options(): AnimationOptions {
    return {
      duration: 0,
      easing: ANIMATION_OPTIONS.EASEOUT
    }
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  private setPosition() {
    const { $root, sliderWidth } = this
    const { slideIndex, dots } = this.store
    const currentTranslate = slideIndex * -sliderWidth!
    const touchIndex = slideIndex
    const from = "touch"

    this.setState(this.positionState(currentTranslate))

    this.slider.setSlideTarget({
      from,
      touchIndex,
      $root
    })

    this.updateDots(touchIndex, dots)
  }

  private updateDots(touchIndex: number, dots: boolean) {
    const { $root } = this
    const { infinite, slidesPerPage } = this.store

    const index = infinite
      ? setIndexBypass(touchIndex, 6, slidesPerPage)
      : touchIndex

    if (dots) this.slider.updateDots(index, $root)
  }

  private prevSlideState(slideIndex: number): Partial<StateType> {
    return {
      prevSlideIndex: slideIndex
    }
  }

  private jumpSlideState(): Partial<StateType> {
    return { isJumpSlide: false }
  }
}

/*
 private incrementSlideIndex(): void {
    const { slideIndex } = this.store
    this.setState({ slideIndex: slideIndex + 1 })
  }

  private decrementSlideIndex(): void {
    const { slideIndex } = this.store
    this.setState({ slideIndex: slideIndex - 1 })
  }

     // this.incrementSlideIndex()

     // this.decrementSlideIndex()
*/
