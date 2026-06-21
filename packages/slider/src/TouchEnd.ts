import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import type { StateType } from "./types"
import { EVENTS, FROM, TIMES, TOUCH_CONFIG, TOUCH_LIMIT } from "./helpers"
import {
  getSlideMovement,
  getSliderNodeList,
  translate3d,
  waitFor
} from "./helpers"
import {
  CurrentEventType,
  CurrentSlideMovement,
  KeyframeAnimation,
  MouseEventOrTouchEvent,
  NavigationDirection,
  TouchMoveAction,
  UpdateSlideIndexType
} from "./types"

export class TouchEnd extends BaseSlider {
  private static readonly TOUCH_MOVE_ACTIONS = {
    DRAG_FREE: "dragFree",
    SWIPE: "swipe",
    FALLBACK: "fallback"
  } as const
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

  public init = (event: MouseEventOrTouchEvent): void => {
    this.nextAction(event)
  }

  private nextAction(event: MouseEventOrTouchEvent): void {
    const target = this.shouldBeEqual(event) as string
    const isNotSwipe = this.shouldNotBeSwipe()
    const isEqual = this.shouldBeEqual(event)

    if (isNotSwipe) return
    if (isEqual) this.setTargetCondition()[target]
    else this.action()
  }

  private shouldBeEqual(event?: MouseEventOrTouchEvent): string | undefined {
    const isEqual = Object.keys(this.evalSwipeConditions(event)).find(
      key => this.evalSwipeConditions(event)[key]
    )
    return isEqual
  }

  protected shouldNotBeSwipe(): boolean {
    const { currentEventType } = this.store

    return currentEventType !== EVENTS.TOUCHMOVE
  }

  private evalSwipeConditions(
    event?: MouseEventOrTouchEvent
  ): Partial<StateType> {
    const isMouseLeave = event?.type === EVENTS.MOUSELEAVE

    return {
      FIRST: isMouseLeave
    }
  }

  private setTargetCondition(): Record<string, void> {
    return {
      FIRST: waitFor(TIMES.SWIPE_MOUSE_LEAVE_DELAY, () => this.action()),
      SECOND: waitFor(0, () => this.action())
    }
  }

  protected action(): void {
    const endTimeState = { endTime: Date.now() }

    this.setState(endTimeState)
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
    const hasTouchTiming = this.hasTouchTiming(startTime, endTime)
    const isFastSwipe = this.isFastSwipe(duration, velocity)

    if (!hasTouchTiming) return TOUCH_LIMIT
    if (isFastSwipe) return TOUCH_LIMIT

    return this.getAdaptiveTouchLimit(velocity)
  }

  private hasTouchTiming(startTime: number, endTime: number): boolean {
    return !!startTime && !!endTime
  }

  private isFastSwipe(duration: number, velocity: number): boolean {
    return (
      duration <= TOUCH_CONFIG.FAST_SWIPE_MAX_MS ||
      velocity >= TOUCH_CONFIG.FAST_VELOCITY_THRESHOLD
    )
  }

  private getAdaptiveTouchLimit(velocity: number): number {
    const speedRatio = this.getTouchSpeedRatio(velocity)
    const threshold = this.getTouchThreshold(speedRatio)

    return this.clampTouchLimit(threshold)
  }

  private getTouchSpeedRatio(velocity: number): number {
    const rawSpeedRatio =
      (TOUCH_CONFIG.FAST_VELOCITY_THRESHOLD - velocity) /
      TOUCH_CONFIG.FAST_VELOCITY_THRESHOLD

    return Math.min(1, Math.max(0, rawSpeedRatio))
  }

  private getTouchThreshold(speedRatio: number): number {
    const touchLimitRange = TOUCH_CONFIG.MAX_LIMIT - TOUCH_CONFIG.SLOW_LIMIT

    return TOUCH_CONFIG.SLOW_LIMIT + Math.round(speedRatio * touchLimitRange)
  }

  private clampTouchLimit(touchLimit: number): number {
    return Math.min(
      TOUCH_CONFIG.MAX_LIMIT,
      Math.max(TOUCH_CONFIG.SLOW_LIMIT, touchLimit)
    )
  }

  private handleTouchMove(): void {
    const touchMoveContext = this.getTouchMoveContext()

    this.applyTouchMoveSetup(
      touchMoveContext.moveSlider,
      touchMoveContext.slideIndex
    )

    this.handleTouchMoveAction(touchMoveContext)
  }

  private handleDragFreeTouchEnd(
    isTouch: boolean,
    isMouseLeave: boolean,
    currentTranslate: number
  ): void {
    const movementState = this.getTouchMovementState()
    const settleTranslate =
      currentTranslate + this.moveSlider * TOUCH_CONFIG.DRAG_FREE_SETTLE_FACTOR

    this.applyTouchMovementState(movementState)
    this.handleDragFreeTouchEndCommit(isTouch, isMouseLeave, settleTranslate)
  }

  private applyTouchMoveSetup(moveSlider: number, slideIndex: number): void {
    this.setMoveSlider(moveSlider)
    this.applyPrevSlideState(slideIndex)
  }

  private setMoveSlider(moveSlider: number): void {
    this.moveSlider = moveSlider
  }

  private handleTouchMoveAction(context: {
    useDragFree: boolean
    isTouch: boolean
    isMouseLeave: boolean
    currentTranslate: number
    swipeDirection: NavigationDirection | null
    movementState: Partial<StateType>
  }): void {
    const {
      useDragFree,
      isTouch,
      isMouseLeave,
      currentTranslate,
      swipeDirection,
      movementState
    } = context
    const touchMoveAction = this.getTouchMoveAction(useDragFree, swipeDirection)

    this.runTouchMoveAction(
      touchMoveAction,
      isTouch,
      isMouseLeave,
      currentTranslate,
      swipeDirection,
      movementState
    )
  }

  private getTouchMoveContext(): {
    slideIndex: number
    currentTranslate: number
    moveSlider: number
    useDragFree: boolean
    isTouch: boolean
    isMouseLeave: boolean
    swipeDirection: NavigationDirection | null
    movementState: Partial<StateType>
  } {
    const {
      isMouseLeave,
      isTouch,
      slideIndex,
      currentTranslate,
      prevTranslate,
      useDragFree
    } = this.store
    const moveSlider = currentTranslate - prevTranslate
    const movementState = this.getTouchMovementState()
    const swipeActions = this.actionsMove(moveSlider)
    const swipeDirection = this.getSwipeDirection(swipeActions)

    return {
      slideIndex,
      currentTranslate,
      moveSlider,
      useDragFree,
      isTouch,
      isMouseLeave,
      swipeDirection,
      movementState
    }
  }

  private shouldHandleDragFreeTouchEnd(useDragFree: boolean): boolean {
    return useDragFree
  }

  private getTouchMoveAction(
    useDragFree: boolean,
    swipeDirection: NavigationDirection | null
  ): TouchMoveAction {
    const shouldHandleDragFree = this.shouldHandleDragFreeTouchEnd(useDragFree)
    const shouldHandleSwipeNavigation =
      this.shouldHandleSwipeNavigation(swipeDirection)

    if (shouldHandleDragFree) return TouchEnd.TOUCH_MOVE_ACTIONS.DRAG_FREE
    if (shouldHandleSwipeNavigation) return TouchEnd.TOUCH_MOVE_ACTIONS.SWIPE

    return TouchEnd.TOUCH_MOVE_ACTIONS.FALLBACK
  }

  private runTouchMoveAction(
    touchMoveAction: TouchMoveAction,
    isTouch: boolean,
    isMouseLeave: boolean,
    currentTranslate: number,
    swipeDirection: NavigationDirection | null,
    movementState: Partial<StateType>
  ): void {
    if (touchMoveAction === TouchEnd.TOUCH_MOVE_ACTIONS.DRAG_FREE) {
      this.runDragFreeTouchEnd(isTouch, isMouseLeave, currentTranslate)
      return
    }

    if (touchMoveAction === TouchEnd.TOUCH_MOVE_ACTIONS.SWIPE) {
      this.runSwipeNavigation(swipeDirection)
      return
    }

    this.handleTouchMoveFallback(isTouch, isMouseLeave, movementState)
  }

  private runDragFreeTouchEnd(
    isTouch: boolean,
    isMouseLeave: boolean,
    currentTranslate: number
  ): void {
    this.handleDragFreeTouchEnd(isTouch, isMouseLeave, currentTranslate)
  }

  private shouldHandleSwipeNavigation(
    swipeDirection: NavigationDirection | null
  ): boolean {
    return swipeDirection !== null
  }

  private runSwipeNavigation(swipeDirection: NavigationDirection | null): void {
    if (!swipeDirection) return

    this.handleSwipeNavigation(swipeDirection)
  }

  private applyTouchMovementState(state: Partial<StateType>): void {
    this.setState(state)
  }

  private handleDragFreeTouchEndCommit(
    isTouch: boolean,
    isMouseLeave: boolean,
    settleTranslate: number
  ): void {
    const shouldCommitDragFree = this.shouldCommitDragFreeTouchEnd(
      isTouch,
      isMouseLeave
    )

    if (!shouldCommitDragFree) return

    this.commitDragFreeTouchEnd(settleTranslate)
  }

  private shouldCommitDragFreeTouchEnd(
    isTouch: boolean,
    isMouseLeave: boolean
  ): boolean {
    return isTouch && !isMouseLeave
  }

  private commitDragFreeTouchEnd(settleTranslate: number): void {
    this.slider.commitFreeTranslate(settleTranslate)
    this.cancelAnimationFrame()
  }

  private navigateBySwipeDirection(direction: NavigationDirection): void {
    const { slideIndex } = this.store
    const slideMovement = getSlideMovement(direction) as UpdateSlideIndexType
    const snappedTranslate = this.calcTranslate()
    const navigationState = this.getSwipeNavigationState(
      slideIndex,
      snappedTranslate,
      slideMovement
    )

    this.applySwipeNavigationState(navigationState)
    this.navigateToSwipeTarget(direction)
  }

  private getSwipeNavigationState(
    slideIndex: number,
    snappedTranslate: number,
    slideMovement: UpdateSlideIndexType
  ): Partial<StateType> {
    return {
      prevSlideIndex: slideIndex,
      currentTranslate: -snappedTranslate,
      prevTranslate: -snappedTranslate,
      currentSlideMovement: slideMovement,
      currentEventType: EVENTS.TOUCHEND as CurrentEventType
    }
  }

  private applySwipeNavigationState(state: Partial<StateType>): void {
    this.setState(state)
  }

  private navigateToSwipeTarget(direction: NavigationDirection): void {
    this.slider.setSlideTarget({
      from: direction,
      $root: this.$root
    })
  }

  private actionsMove(moveSlider: number): {
    isNext: boolean
    isPrev: boolean
  } {
    const { slideIndex } = this.store
    const { slides } = this
    const isNext = this.goToNextSlide(moveSlider, slideIndex, slides)
    const isPrev = this.goToPrevSlide(moveSlider, slideIndex)

    return { isNext, isPrev }
  }

  private getSwipeDirection(actions: {
    isNext: boolean
    isPrev: boolean
  }): NavigationDirection | null {
    const { isNext, isPrev } = actions

    if (isNext) return FROM.NEXT
    if (isPrev) return FROM.PREV

    return null
  }

  private handleSwipeNavigation(direction: NavigationDirection): void {
    this.navigateBySwipeDirection(direction)
    this.cancelAnimationFrame()
  }

  private handleTouchMoveFallback(
    isTouch: boolean,
    isMouseLeave: boolean,
    movementState: Partial<StateType>
  ): void {
    const shouldCommitTouchMoveFallback = this.shouldCommitTouchMoveFallback(
      isTouch,
      isMouseLeave
    )

    if (!shouldCommitTouchMoveFallback) {
      this.applyTouchMovementState(movementState)
      return
    }

    this.applyTouchMovementState(movementState)
    this.commitTouchMoveFallback()
  }

  private shouldCommitTouchMoveFallback(
    isTouch: boolean,
    isMouseLeave: boolean
  ): boolean {
    return isTouch && !isMouseLeave
  }

  private commitTouchMoveFallback(): void {
    this.setPosition()
    this.cancelAnimationFrame()
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [{ transform: translate3d(currentTranslate) }]
  }

  protected getSpeedInteraction(): number {
    const { startTime, endTime } = this.store

    return Math.abs(startTime - endTime)
  }

  private cancelAnimationFrame(): void {
    const { animationId } = this.store

    if (typeof animationId === "number") {
      cancelAnimationFrame(animationId)
    }
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

  private setPosition(): void {
    const { slideIndex } = this.store
    const translate = this.calcTranslate()
    const translateState = this.getTouchEndTranslateState(translate)

    this.applyTouchEndTranslateState(translateState)
    this.navigateToTouchEndTarget(slideIndex)
  }

  private getTouchEndTranslateState(translate: number): Partial<StateType> {
    return {
      currentTranslate: -translate,
      prevTranslate: -translate
    }
  }

  private applyTouchEndTranslateState(state: Partial<StateType>): void {
    this.setState(state)
  }

  private navigateToTouchEndTarget(slideIndex: number): void {
    this.slider.setSlideTarget({
      from: "touchend",
      touchIndex: slideIndex,
      $root: this.$root
    })
  }

  private getTouchMovementState(): Partial<StateType> {
    const currentSlideMovement: CurrentSlideMovement = null

    return { currentSlideMovement }
  }

  private applyPrevSlideState(slideIndex: number): void {
    const prevSlideState = this.prevSlideState(slideIndex)

    this.setState(prevSlideState)
  }

  private prevSlideState(slideIndex: number): Partial<StateType> {
    return { prevSlideIndex: slideIndex }
  }

  private eventTargetState(): Partial<StateType> {
    return { currentEventType: EVENTS.TOUCHEND }
  }
}
