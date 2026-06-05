import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { EVENTS, TOUCH_LIMIT } from "./helpers"
import { getSliderNodeList, translate3d, waitFor } from "./helpers"
import {
  CurrentSlideMovement,
  KeyframeAnimation,
  UpdateSlideIndexType
} from "./types"

export class TouchEnd extends BaseSlider {
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

  public init = (event: any): void => {
    this.nextAction(event)
  }

  private nextAction(event: any): void {
    const target = this.shouldBeEqual(event) as string
    const isNotSwipe = this.shouldNotBeSwipe()
    const isEqual = this.shouldBeEqual(event)

    if (isNotSwipe) return
    if (isEqual) this.setTargetCondition()[target]
    else this.action()
  }

  private shouldBeEqual(event?: any): string | undefined {
    const isEqual = Object.keys(this.evalSwipeConditions(event)).find(
      key => this.evalSwipeConditions(event)[key]
    )
    return isEqual
  }

  protected shouldNotBeSwipe(): boolean {
    const { currentEventType } = this.store
    return currentEventType !== "touchmove"
  }

  private evalSwipeConditions(event: any): Partial<StateType> {
    const isMouseLeave = event.type === "mouseleave"
    return {
      FIRST: isMouseLeave
    }
  }

  private setTargetCondition(): Record<any, any> {
    return {
      FIRST: waitFor(100, () => this.action()),
      SECOND: waitFor(0, () => this.action())
    }
  }

  protected action(): void {
    this.setState({ endTime: Date.now() })
    this.setState(this.eventTargetState())
    this.handleTouchMove()
    this.setState(this.mainState())
  }

  private mainState(): Partial<StateType> {
    return {
      isDragging: false,
      isMouseLeave: true,
      isTouch: false
    }
  }

  private getTouchLimit(moveSlider: number): number {
    const { startTime, endTime } = this.store
    const duration = Math.max(0, endTime - startTime)
    const distance = Math.abs(moveSlider)
    const velocity = distance / Math.max(1, duration)
    const fastSwipeMaxMs = 180
    const fastVelocityThreshold = 0.35
    const slowLimit = 35
    const maxLimit = 55
    const speedRatio = Math.min(
      1,
      Math.max(0, (fastVelocityThreshold - velocity) / fastVelocityThreshold)
    )
    const threshold =
      slowLimit + Math.round(speedRatio * (maxLimit - slowLimit))

    if (!startTime || !endTime) return TOUCH_LIMIT
    if (duration <= fastSwipeMaxMs || velocity >= fastVelocityThreshold) {
      return TOUCH_LIMIT
    }

    return Math.min(maxLimit, Math.max(slowLimit, threshold))
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
    this.setState(this.prevSlideState(slideIndex))

    const { isNext, isPrev } = this.actionsMove()

    if (isNext || isPrev) {
      this.updateSlideIndex(isNext ? "increment" : "decrement")
      this.movement = true
    } else {
      this.setState({ currentSlideMovement: null })
    }

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      this.cancelAnimationFrame()
      this.movement = false
    }
  }

  private actionsMove() {
    const { slideIndex } = this.store
    const { moveSlider, slides } = this
    const isNext = this.goToNextSlide(moveSlider, slideIndex, slides)
    const isPrev = this.goToPrevSlide(moveSlider, slideIndex)
    return { isNext, isPrev }
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
    if (typeof animationId === "number") {
      cancelAnimationFrame(animationId)
    }
  }

  private updateSlideIndex(action: UpdateSlideIndexType): void {
    const incrementOrDecrement = this.incrementOrDecrementState(action)
    const currentSlideMovement = this.slideMovementState(action)
    const objState = { ...incrementOrDecrement, ...currentSlideMovement }
    const { slideIndex, slidesPerPage } = { ...this.store, ...objState }
    objState.activePage = Math.floor(slideIndex / slidesPerPage)
    this.setState(objState)
  }

  private slideMovementState(action: CurrentSlideMovement): Partial<StateType> {
    return { currentSlideMovement: action }
  }

  private incrementOrDecrementState(
    action: UpdateSlideIndexType
  ): Partial<StateType> {
    const { slideIndex, slidesPerPage, slidesPerView } = this.store
    const step = slidesPerPage || 1
    const totalSlides = this.slides.length
    const view = slidesPerView || 1
    const maxStartIndex = Math.max(totalSlides - view, 0)
    let nextIndex = 0
    const lastGroupStep = this.getLastGroupStep(
      totalSlides,
      slidesPerView,
      slidesPerPage
    )
    const hasIncompleteGroup = lastGroupStep < slidesPerView

    console.log("slideIndex", slideIndex)

    if (
      action === "decrement" &&
      hasIncompleteGroup &&
      slideIndex === maxStartIndex
    ) {
      nextIndex = slideIndex - lastGroupStep
    } else {
      // comportamento padrão
      nextIndex =
        action === "increment"
          ? (slideIndex || 0) + step
          : (slideIndex || 0) - step
    }

    console.log("slideIndex touch", nextIndex)

    // clamp para não ultrapassar limites
    if (nextIndex > maxStartIndex) nextIndex = maxStartIndex
    if (nextIndex < 0) nextIndex = 0

    return { slideIndex: nextIndex }
  }

  private goToNextSlide(
    moveSlider: number,
    currentIndex: number,
    element: HTMLElement[]
  ): boolean {
    const touchLimit = this.getTouchLimit(moveSlider)
    const isMovedByThreshold =
      moveSlider < (-this.sliderWidth! * touchLimit) / 100

    const isNotLastSlide = currentIndex < element.length - 1

    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const touchLimit = this.getTouchLimit(moveSlider)
    const isMovedByThreshold =
      moveSlider > (this.sliderWidth! * touchLimit) / 100
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  private setPosition() {
    const { slideIndex } = this.store
    const translate = this.calcTranslate()

    this.setState({
      currentTranslate: -translate,
      prevTranslate: -translate
    })

    this.slider.setSlideTarget({
      from: "touchend",
      touchIndex: slideIndex,
      $root: this.$root
    })
  }
  private prevSlideState(slideIndex: number): Partial<StateType> {
    return { prevSlideIndex: slideIndex }
  }

  private eventTargetState(): Partial<StateType> {
    return { currentEventType: EVENTS.TOUCHEND }
  }
}
