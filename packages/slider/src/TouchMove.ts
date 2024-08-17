import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { EVENTS, MOVE_TO_LIMIT, POSITION, SLIDE_INDEX } from "./constants"
import { getAxisX } from "./helpers"
import {
  IndexData,
  IndexKey,
  IndexMap,
  MouseEventOrTouchEvent,
  PositionSlider
} from "./types"

export class TouchMove extends BaseSlider {
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
    const { isDragging } = this.store

    if (isDragging) {
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

  protected handleMove(): boolean | void {
    const { infinite, slidesPerPage } = this.store

    infinite && slidesPerPage <= 1 && this.infiniteMove()
  }

  private eventTargetState(): Partial<StateType> {
    return {
      currentEventType: EVENTS.TOUCHMOVE
    }
  }

  protected infiniteMove(): void {
    const isEqual = Object.keys(this.evalSlideConditions()).find(
      key => this.evalSlideConditions()[key]
    )

    if (isEqual) {
      this.jumpSlideTo(SLIDE_INDEX[isEqual as keyof typeof SLIDE_INDEX])
    }
  }

  private evalSlideConditions(): Partial<StateType> {
    const { slideIndex } = this.store
    const isFirstCloned = slideIndex === 0
    const isLastCloned = slideIndex === this.childrenCount - 1

    return {
      FIRST: this.movingTo(POSITION.RIGHT) && isFirstCloned,
      // SECOND: this.movingTo(POSITION.RIGHT) && isSecondSlide,
      LAST: this.movingTo(POSITION.LEFT) && isLastCloned
    }
  }

  private jumpSlideTo(to: keyof IndexMap): void {
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

  private getIndexes(): Record<IndexKey, number> {
    const { FIRST, LAST } = SLIDE_INDEX

    return {
      [FIRST]: 1,
      [LAST]: 4
    }
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

  private mapIndex(): Map<IndexKey, IndexData> {
    const penultIndex = this.calcTranslate(this.childrenCount - 2)
    const secondIndex = this.calcTranslate(1)
    const { FIRST, LAST } = SLIDE_INDEX
    // const lastIndex = this.calcTranslate(this.childrenCount - 1)

    return new Map([
      [FIRST, { currentIndex: LAST, translate: penultIndex }],
      // [SLIDE_INDEX.SECOND, { currentIndex: "Last", translate: lastIndex }],
      [LAST, { currentIndex: FIRST, translate: secondIndex }]
    ])
  }
}
