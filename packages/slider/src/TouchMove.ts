import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import type { StateType } from "./types"
import { EVENTS } from "./helpers"
import { MOVE_TO_LIMIT, POSITION, getAxisX } from "./TouchUtils"
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
