import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import type { StateType } from "./types"
import {
  CLASS_VALUES,
  EVENTS,
  MOVE_TO_LIMIT,
  POSITION,
  getAxisX,
  hasClass,
  translate3d
} from "./helpers"
import type { MouseEventOrTouchEvent, PositionSlider } from "./types"

export class TouchMove extends BaseSlider {
  private currentPosition: number
  protected previousPosition: number
  private skipSlide: boolean
  private currentIndex: number
  protected translate: number
  private animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.currentPosition = 0
    this.previousPosition = 0
    this.currentIndex = 0
    this.translate = 0
    this.skipSlide = false
    this.animation = new AnimationFrame($root)
  }

  public init(event: MouseEventOrTouchEvent): void {
    const { isDragging } = this.store

    if (isDragging) {
      this.updatePosition(event)
      this.prepareLoopDrag()
      this.setState(this.eventTargetState())
      this.setState(this.skipSlide ? this.infiniteState() : this.mainState())
    }
  }

  protected updatePosition(event: MouseEvent | TouchEvent): void {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(event)
  }

  private eventTargetState(): Partial<StateType> {
    return {
      currentEventType: EVENTS.TOUCHMOVE
    }
  }

  private prepareLoopDrag(): void {
    const { slideIndex, startPos, useLoop, useDragFree } = this.store
    const canPrepareLoopDrag =
      useLoop && !useDragFree && this.store["loopPreJumpTargetIndex"] == null

    if (!canPrepareLoopDrag) return

    const movement = this.currentPosition - startPos
    const isMovingNext = movement < 0
    const isMovingPrev = movement > 0

    if (!isMovingNext && !isMovingPrev) return

    const firstRealIndex = this.getFirstRealSlideIndex()
    const lastRealIndex = this.getLastRealSlideIndex()
    const shouldPrepareNext = isMovingNext && slideIndex === lastRealIndex
    const shouldPreparePrev = isMovingPrev && slideIndex === firstRealIndex

    if (shouldPrepareNext) {
      this.prepareLoopDragFromBoundary(slideIndex, firstRealIndex, "prefix")
      return
    }

    if (shouldPreparePrev) {
      this.prepareLoopDragFromBoundary(slideIndex, lastRealIndex, "suffix")
    }
  }

  private getFirstRealSlideIndex(): number {
    return this.slides.findIndex(slide => !hasClass(slide, CLASS_VALUES.CLONED))
  }

  private getLastRealSlideIndex(): number {
    return this.slides.findLastIndex(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
  }

  private prepareLoopDragFromBoundary(
    realIndex: number,
    targetIndex: number,
    cloneSide: "prefix" | "suffix"
  ): void {
    const cloneIndex = this.getEquivalentCloneIndex(realIndex, cloneSide)

    if (cloneIndex < 0) return

    const translate = -this.calcTranslateForIndex(cloneIndex)

    this.cancelTrackAnimations()
    this.$children.style.transform = translate3d(translate)
    this.setState({
      slideIndex: cloneIndex,
      prevTranslate: translate,
      currentTranslate: translate,
      startPos: this.currentPosition,
      loopPreJumpTargetIndex: targetIndex
    })
  }

  private getEquivalentCloneIndex(
    realIndex: number,
    cloneSide: "prefix" | "suffix"
  ): number {
    const dataIndex = this.getSlideDataIndexValue(this.slides[realIndex])
    const firstRealIndex = this.getFirstRealSlideIndex()
    const lastRealIndex = this.getLastRealSlideIndex()

    return this.slides.findIndex((slide, index) => {
      const isMatchingClone =
        this.getSlideDataIndexValue(slide) === dataIndex &&
        hasClass(slide, CLASS_VALUES.CLONED)
      const isPrefixClone = cloneSide === "prefix" && index < firstRealIndex
      const isSuffixClone = cloneSide === "suffix" && index > lastRealIndex

      return isMatchingClone && (isPrefixClone || isSuffixClone)
    })
  }

  private cancelTrackAnimations(): void {
    this.$children.getAnimations().forEach(animation => animation.cancel())
  }

  private infiniteState(): Partial<StateType> {
    const { currentIndex, translate } = this

    return {
      slideIndex: currentIndex,
      prevTranslate: translate
    }
  }

  private mainState(): Partial<StateType> {
    const { prevTranslate, startPos } = this.store
    const { currentPosition } = this

    return {
      isTouch: true,
      isMouseLeave: false,
      currentTranslate: prevTranslate + currentPosition - startPos!,
      animationID: requestAnimationFrame(() => this.animation.init())
    }
  }

  protected movingTo(position: PositionSlider): boolean {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = Math.abs(
      (this.sliderWidth! * MOVE_TO_LIMIT) / 100 - this.sliderWidth!
    )

    return position === POSITION.RIGHT ? translate <= limit : translate >= limit
  }
}
