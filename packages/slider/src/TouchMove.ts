import { AnimationFrame } from "./AnimationFrame"
import { HandleMovement } from "./HandleMovement"
import { StateType } from "./State"
import { EVENTS, FROM, MOVE_TO_LIMIT, POSITION } from "./constants"
import { getAxisX } from "./helpers"
import {
  IndexData,
  IndexMap,
  MouseEventOrTouchEvent,
  PositionSlider
} from "./types"

export class TouchMove extends HandleMovement {
  private currentPosition: number
  protected previousPosition: number
  private skipSlide: boolean
  private currentIndex: number
  private translate: number
  animation: AnimationFrame

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
    const { isDragging, currentEventType } = this.store
    const isRightClick = currentEventType === FROM.RIGHT_CLICK

    if (isDragging && !isRightClick) {
      this.updatePosition(event)
      this.handleMove()
      this.setState(this.eventTargetState())
      this.setState(this.skipSlide ? this.infiniteState() : this.mainState())
      this.setSkipSlide(false)
    }
  }

  protected updatePosition(event: MouseEvent | TouchEvent) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(event)
  }

  private eventTargetState(): Partial<StateType> {
    return {
      currentEventType: EVENTS.TOUCHMOVE
    }
  }

  protected evalSlideConditions(): Partial<StateType> {
    const { slideIndex } = this.store
    const isFirstCloned = slideIndex === 0
    const isLastCloned = slideIndex === this.childrenCount - 1

    return {
      FIRST: this.movingTo(POSITION.RIGHT) && isFirstCloned,
      LAST: this.movingTo(POSITION.LEFT) && isLastCloned
    }
  }

  protected jumpSlideTo(to: keyof IndexMap): void {
    const indexData = this.mapIndex().get(to)
    const { currentIndex, translate } = indexData as IndexData

    if (indexData) {
      const indexes = this.getIndexes()
      this.setSkipSlide(true)
      this.currentIndex = indexes[currentIndex]
      this.translate = translate
      this.state.set(this.jumpSlideState())
    }
  }

  protected setSkipSlide(c: boolean) {
    this.skipSlide = c
  }

  private jumpSlideState() {
    return { isJumpSlide: true }
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
      animationID: requestAnimationFrame(this.animation.init)
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

/*

   // SECOND: this.movingTo(POSITION.RIGHT) && isSecondSlide,
protected infiniteMove(): void {
    const isEqual = Object.keys(this.evalSlideConditions()).find(
      key => this.evalSlideConditions()[key]
    )

    if (isEqual) {
      this.jumpSlideTo(SLIDE_INDEX[isEqual as keyof typeof SLIDE_INDEX])
    }
  }*/

/*protected handleMove(): boolean | void {
    const { infinite, slidesPerPage } = this.store

    infinite && slidesPerPage <= 1 && this.infiniteMove()
  }*/
