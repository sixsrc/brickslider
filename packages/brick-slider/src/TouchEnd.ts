import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { TOUCH_LIMIT } from "./constants"
import {
  getSliderNodeList,
  reorderIndex,
  translate3d,
  waitFor
} from "./helpers"
import { KeyframeAnimation, UpdateSlideIndexType } from "./types"

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
    this.nextAction(event)
  }

  private nextAction(event: any) {
    const target = this.shouldBeEqual(event) as string
    const isNotSwipe = this.shouldNotBeSwipe()
    const isEqual = this.shouldBeEqual(event)

    if (isNotSwipe) return
    if (isEqual) this.setTargetCondition()[target]
    else this.action()
  }

  private shouldBeEqual(event?: any) {
    const isEqual = Object.keys(this.evalSwipeConditions(event)).find(
      key => this.evalSwipeConditions(event)[key]
    )

    return isEqual
  }

  protected shouldNotBeSwipe() {
    const { currentEventType } = this.store

    return currentEventType !== "touchMove"
  }

  private evalSwipeConditions(event: any): Partial<StateType> {
    const isMouseLeave = event.type === "mouseleave"
    const isMouseLeaveAndSpeedInteraction = this.getSpeedInteraction() <= 150

    return {
      FIRST: isMouseLeave
      // SECOND: !isMouseLeave && isMouseLeaveAndSpeedInteraction
    }
  }

  private setTargetCondition(): any {
    return {
      FIRST: waitFor(100, () => this.action()),
      SECOND: waitFor(0, () => this.action())
    }
  }

  protected action() {
    this.setState(this.eventTargetState())
    this.handleTouchMove()
    this.setState(this.mainState())
  }

  protected shouldPreventNextAction() {
    const { currentEventType } = this.store
    return currentEventType === "touchMove"
  }

  private mainState(): Partial<StateType> {
    return {
      endTime: new Date().getMilliseconds(),
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
      slideIndex,
      currentTranslate,
      prevTranslate
    } = this.store

    this.moveSlider = currentTranslate - prevTranslate

    this.cancelAnimationFrame()

    this.setState(this.prevSlideState(slideIndex))

    if (this.goToNextSlide(this.moveSlider, slideIndex, this.slides)) {
      this.updateSlideIndex("increment")
    }

    if (this.goToPrevSlide(this.moveSlider, slideIndex)) {
      this.updateSlideIndex("decrement")
    }

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      this.setState(this.jumpSlideState())
    }
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [{ transform: translate3d(currentTranslate) }]
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
  private eventTargetState(): Partial<StateType> {
    return {
      currentEventType: "touchEnd"
    }
  }
}
