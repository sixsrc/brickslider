import { BaseSlider } from "./BaseSlider"
import { TouchEnd } from "./TouchEnd"
import { TouchMove } from "./TouchMove"
import { TouchStart } from "./TouchStart"
import { EVENTS } from "./constants"
import { listener } from "./helpers"
import { TouchListenersParams } from "./types"

export class Swipe extends BaseSlider {
  private touchStart: TouchStart
  private touchEnd: TouchEnd
  private touchMove: TouchMove

  constructor($root: string) {
    super($root)
    this.touchStart = new TouchStart(this.$root)
    this.touchEnd = new TouchEnd(this.$root)
    this.touchMove = new TouchMove(this.$root)
  }

  public init(): void {
    this.setTouchListeners(this.params())
  }

  private params(): TouchListenersParams {
    const { touchStart, touchEnd, touchMove } = this

    return {
      element: this.$track,
      index: 0,
      touchStart: touchStart.init(),
      touchEnd: touchEnd.init.bind(touchEnd),
      touchMove: touchMove.init.bind(touchMove)
    }
  }

  private setTouchListeners(params: TouchListenersParams): void {
    const { element, touchStart, touchEnd, touchMove } = params

    listener([EVENTS.TOUCHSTART, EVENTS.MOUSEDOWN], element, touchStart)
    listener(
      [EVENTS.TOUCHEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP],
      element,
      touchEnd
    )
    listener([EVENTS.TOUCHMOVE, EVENTS.MOUSEMOVE], element, touchMove)
  }
}

/*  slides.forEach((slide, index) => {
      const params: TouchListenersParams = {
        element: slide,
        index,
        touchStart: touchStart.init(0),
        touchEnd: touchEnd.init.bind(touchEnd),
        touchMove: touchMove.init.bind(touchMove)
      }
      initTouchListeners(params)
    })

    */
