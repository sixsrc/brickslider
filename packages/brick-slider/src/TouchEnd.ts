import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { ANIMATION_OPTIONS, TIMES, TOUCH_LIMIT } from "./constants"
import {
  getFastInteraction,
  getSliderNodeList,
  listener,
  reorderIndex,
  translate3d,
  waitFor
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
  isFastInteraction: boolean

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.animation = new AnimationFrame(this.$root)
    this.moveSlider = 0
    this.isFastInteraction = false
  }

  public init = (event: any): void => {
    var rect = event.target.getBoundingClientRect()
    var x = event.clientX - rect.left

    console.log(x)

    if (this.store.slideIndex === 0) {
      this.state.set({
        slideIndex: 4,
        currentTranslate: -2352,
        prevTranslate: -2352
      })
      this.animate([{ transform: translate3d(this.store.currentTranslate) }], {
        duration: 0,

        fill: ANIMATION_OPTIONS.FORWARDS
      })
    } else {
      this.handleTouchMove()
      this.setState(this.mainState())
    }
  }

  private mainState(): Partial<StateType> {
    return {
      isDragging: false,
      isMouseLeave: true,
      isTouch: false
    }
  }

  private positionState(currentTranslate: number): Partial<StateType> {
    return {
      sliderReady: true,
      currentTranslate,
      prevTranslate: currentTranslate
    }
  }

  private handleTouchMove(): void {
    const {
      isMouseLeave,
      isTouch,
      sliderReady,
      slideIndex,
      currentTranslate,
      prevTranslate
    } = this.store

    this.moveSlider = currentTranslate - prevTranslate

    this.cancelAnimationFrame()

    /*const handleFastInteraction = getFastInteraction(500)

    listener(["pointerup"], this.$children, event => {
      handleFastInteraction(event)
    })

    listener(["doubletap"], this.$children, () => {
      console.log("doubletap")
    })*/

    this.setState(this.prevSlideState(slideIndex))

    if (this.goToNextSlide(this.moveSlider, slideIndex, this.slides)) {
      this.updateSlideIndex("increment")
    }

    if (this.goToPrevSlide(this.moveSlider, slideIndex)) {
      this.updateSlideIndex("decrement")
    }

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      // this.animate(this.keyFrames(), this.options(0))
      this.setState(this.jumpSlideState())
    }
  }

  protected getSpeedInteraction() {
    const { startTime, endTime } = this.store

    return Math.abs(startTime - endTime)
  }

  private cancelAnimationFrame(): void {
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

    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold =
      moveSlider > (this.sliderWidth! * TOUCH_LIMIT) / 100
    const isNotFirstSlide = currentIndex > 0

    return isMovedByThreshold && isNotFirstSlide
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    const { moveSlider } = this

    return [
      { transform: translate3d(currentTranslate) },
      {
        transform: translate3d(currentTranslate + moveSlider)
      }
    ]
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
    const { $root, slider } = this
    const { infinite, slidesPerPage } = this.store
    const countSlides = this.childrenCount

    const index = infinite
      ? reorderIndex(touchIndex, countSlides, slidesPerPage)
      : touchIndex

    if (dots) slider.updateDots(index, $root)
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
