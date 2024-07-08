import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { MOVE_TO_LIMIT, POSITION, SLIDE_INDEX } from "./constants"
import { eventX, getAxisX, translate3d } from "./helpers"
import {
  IndexData,
  IndexKey,
  IndexMap,
  KeyframeAnimation,
  MouseEventOrTouchEvent,
  PositionSlider
} from "./types"

enum IndexesNames {
  First = 0,
  Second = 1,
  Third = 4,
  Last = 5
}

export class TouchMove extends BaseSlider {
  private currentPosition: number
  protected previousPosition: number
  private skipSlide: boolean
  private currentIndex: number
  private translate: number

  constructor($root: string) {
    super($root)
    this.currentPosition = 0
    this.previousPosition = 0
    this.currentIndex = 0
    this.translate = 0
    this.skipSlide = false
  }

  public init(event: MouseEventOrTouchEvent): void {
    const { isDragging } = this.store

    if (isDragging) {
      this.updatePosition(event)
      this.handleSwipe()
      this.setState(this.skipSlide ? this.infiniteState() : this.mainState())
      this.animate(this.keyFrames(), this.options(0))
      this.setSkipSlide(false)
    }
  }

  protected updatePosition(event: MouseEvent | TouchEvent) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))
  }

  protected movingTo(position: PositionSlider): boolean {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = (this.sliderWidth! * MOVE_TO_LIMIT) / 100 - this.sliderWidth!

    return position === POSITION.RIGHT ? translate <= limit : translate >= limit
  }

  private mainState(): Partial<StateType> {
    const { prevTranslate, startPos } = this.store
    const { currentPosition } = this

    return {
      isTouch: true,
      currentTranslate: prevTranslate + currentPosition - startPos!
    }
  }

  private infiniteState(): Partial<StateType> {
    const { currentIndex, translate } = this

    return {
      slideIndex: currentIndex,
      prevTranslate: translate
    }
  }

  protected handleSwipe(): boolean | void {
    const { infinite, slidesPerPage } = this.store

    infinite && slidesPerPage <= 1 && this.infiniteSwipe()
  }

  protected infiniteSwipe(): void {
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
    const isSecondSlide = slideIndex === 1
    const isLastCloned = slideIndex === 5

    return {
      FIRST: isFirstCloned,
      SECOND: this.movingTo(POSITION.RIGHT) && isSecondSlide,
      LAST: this.movingTo(POSITION.LEFT) && isLastCloned
    }
  }

  private jumpSlideTo(to: keyof IndexMap): void {
    const indexData = this.mapIndex().get(to)

    if (indexData) {
      this.setSkipSlide(true)
      this.currentIndex = IndexesNames[indexData.currentIndex]
      this.translate = indexData.translate
      this.state.set({ isJumpSlide: true })
    }
  }

  private mapIndex(): Map<IndexKey, IndexData> {
    return new Map([
      [SLIDE_INDEX.FIRST, { currentIndex: "Third", translate: -2352 }],
      [SLIDE_INDEX.SECOND, { currentIndex: "Last", translate: -2940 }],
      [SLIDE_INDEX.LAST, { currentIndex: "Second", translate: -588 }]
    ])
  }

  protected setSkipSlide(c: boolean) {
    this.skipSlide = c
  }
}

/*protected setState(): void {
    this.state.set(this.skipSlide ? this.infiniteState() : this.mainState())
  }*/
