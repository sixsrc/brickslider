import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { ANIMATION_OPTIONS } from "./constants"
import { adjustIndex, getAxisX, listener, translate3d } from "./helpers"
import { MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private animation: AnimationFrame
  private lastEventTime: number
  private eventCount: number

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
    this.lastEventTime = 0
    this.eventCount = 0
  }

  public init(event: MouseEventOrTouchEvent): void {
    const element = event?.target as HTMLElement

    var rect = element?.getBoundingClientRect()

    var x = event.clientX - rect.left

    console.log(x)

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
