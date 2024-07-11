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
      element: this.getTrackChildren,
      index: 0,
      touchStart: touchStart.init.bind(touchStart) as EventListener,
      touchEnd: touchEnd.init.bind(touchEnd) as EventListener,
      touchMove: touchMove.init.bind(touchMove) as EventListener
    }
  }

  private setTouchListeners(params: TouchListenersParams): void {
    const { element, touchStart, touchEnd, touchMove } = params
    const touchStartEvents = [EVENTS.TOUCHSTART, EVENTS.MOUSEDOWN]
    const touchEndEvents = [EVENTS.TOUCHEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP]
    const touchMoveEvents = [EVENTS.TOUCHMOVE, EVENTS.MOUSEMOVE]

    listener(touchStartEvents, element, touchStart)

    listener(touchEndEvents, element, touchEnd)
    listener(touchMoveEvents, element, touchMove)
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
