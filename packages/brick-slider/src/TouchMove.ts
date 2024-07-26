import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { MOVE_TO_LIMIT, POSITION, SLIDE_INDEX } from "./constants"
import { getAxisX } from "./helpers"
import {
  IndexData,
  IndexKey,
  IndexMap,
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
    //console.log("touchmove")
    if (isDragging) {
      this.updatePosition(event)
      this.handleSwipe()
      this.setState(this.eventTargetState())
      this.setState(this.skipSlide ? this.infiniteState() : this.mainState())
      this.setSkipSlide(false)
    }
  }

  private eventTargetState(): Partial<StateType> {
    return {
      currentEventType: "touchMove"
    }
  }

  protected updatePosition(event: MouseEvent | TouchEvent) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(event)
  }

  protected movingTo(position: PositionSlider): boolean {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = Math.abs(
      (this.sliderWidth! * MOVE_TO_LIMIT) / 100 - this.sliderWidth!
    )
    //console.log("asas", translate, limit)
    return position === POSITION.RIGHT ? translate <= limit : translate >= limit
  }

  private mainState(): Partial<StateType> {
    const { prevTranslate, startPos } = this.store
    const { currentPosition } = this

    // console.log("currentTRanslate", this.store.currentTranslate)

    return {
      isTouch: true,
      isMouseLeave: false,
      currentTranslate: prevTranslate + currentPosition - startPos!,
      animationID: requestAnimationFrame(this.animation.init)
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
    const { childrenCount } = this

    const isFirstCloned = slideIndex === 0
    const isSecondSlide = slideIndex === 1
    const isLastCloned = slideIndex === childrenCount - 1

    return {
      FIRST: this.movingTo(POSITION.RIGHT) && isFirstCloned,
      // SECOND: this.movingTo(POSITION.RIGHT) && isSecondSlide,
      LAST: this.movingTo(POSITION.LEFT) && isLastCloned
    }
  }

  private jumpSlideTo(to: keyof IndexMap): void {
    const indexData = this.mapIndex().get(to)

    if (indexData) {
      this.setSkipSlide(true)
      this.currentIndex = IndexesNames[indexData.currentIndex]

      //console.log("currentIndex", this.currentIndex)
      this.translate = indexData.translate
      this.state.set(this.jumpSlideState())
    }
  }

  private jumpSlideState() {
    return { isJumpSlide: true }
  }

  private mapIndex(): Map<IndexKey, IndexData> {
    const { childrenCount } = this
    const penultIndex = this.calcTranslate(childrenCount - 2)
    const lastIndex = this.calcTranslate(childrenCount - 1)
    const secondIndex = this.calcTranslate(1)

    return new Map([
      [SLIDE_INDEX.FIRST, { currentIndex: "Third", translate: penultIndex }],
      [SLIDE_INDEX.SECOND, { currentIndex: "Last", translate: lastIndex }],
      [SLIDE_INDEX.LAST, { currentIndex: "Second", translate: secondIndex }]
    ])
  }

  protected setSkipSlide(c: boolean) {
    this.skipSlide = c
  }
}

/*

if (this.skipSlide) {
        duration = 0
        waitFor(0, () => (duration = 400))
      }
*/
