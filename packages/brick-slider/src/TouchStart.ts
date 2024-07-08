import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { adjustIndex, getAxisX } from "./helpers"
import { MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
  }

  public init(event: MouseEventOrTouchEvent): void {
    this.setState(this.mainState(event))
  }

  protected mainState(event: TouchEvent | MouseEvent) {
    const { slideIndex, slidesPerPage } = this.store
    const isTrue = slidesPerPage <= 1
    const index = isTrue ? adjustIndex(slideIndex, slidesPerPage) : slideIndex

    return {
      startTime: new Date().getMilliseconds(),
      slideIndex: index,
      startPos: getAxisX(event),
      isDragging: true,
      isMouseLeave: false,
      animationID: requestAnimationFrame(this.animation.init)
    }
  }
}

/*
 protected eventX: null | TouchEvent | MouseEvent
     this.eventX = null
  this.handleTouchStart(event)
  private handleTouchStart(event: TouchEvent | MouseEvent) {
    this.eventX = eventX(event as MouseEvent | TouchEvent)
  }

*/
