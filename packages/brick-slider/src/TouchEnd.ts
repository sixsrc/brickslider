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

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  protected animation: AnimationFrame
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
  ): Partial<StateType> {
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

    //  console.log("moveSlider", moveSlider)

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

    // console.log("currentTranslate", currentTranslate, slideIndex)

    this.setState(this.positionState(currentTranslate))

    this.slider.setSlideTarget({
      from,
      touchIndex,
      $root
    })

    this.updateDots(touchIndex, dots)
  }

  private updateDots(touchIndex: number, dots: boolean) {
    const { $root, slider } = this
    const { infinite, slidesPerPage } = this.store
    const countSlides = this.childrenCount
    const { updateDots } = slider

    const index = infinite
      ? setIndexBypass(touchIndex, countSlides, slidesPerPage)
      : touchIndex

    if (dots) updateDots(index, $root)
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
