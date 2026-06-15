import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./helpers"
import { listener } from "./helpers"
import type { MouseEventOrTouchEvent, TouchListenersParams } from "./types"

type TouchHandler = {
  init: (event: MouseEventOrTouchEvent) => void
}

export class Swipe extends BaseSlider {
  private touchStart?: TouchHandler
  private touchEnd?: TouchHandler
  private touchMove?: TouchHandler

  constructor($root: string) {
    super($root)
  }

  public async init(): Promise<void> {
    await this.loadTouchHandlers()
    this.setListeners(this.params())
  }

  private async loadTouchHandlers(): Promise<void> {
    const [{ TouchStart }, { TouchEnd }, { TouchMove }] = await Promise.all([
      import("./TouchStart"),
      import("./TouchEnd"),
      import("./TouchMove")
    ])

    this.touchStart = new TouchStart(this.$root)
    this.touchEnd = new TouchEnd(this.$root)
    this.touchMove = new TouchMove(this.$root)
  }

  private params(): TouchListenersParams {
    const { touchStart, touchEnd, touchMove } = this

    return {
      element: this.$track,
      index: 0,
      touchStart: touchStart?.init.bind(touchStart) as EventListener,
      touchEnd: touchEnd?.init.bind(touchEnd) as EventListener,
      touchMove: touchMove?.init.bind(touchMove) as EventListener
    }
  }

  private setListeners(params: TouchListenersParams): void {
    const { element, touchStart, touchEnd, touchMove } = params
    const touchStartEvents = [EVENTS.TOUCHSTART, EVENTS.MOUSEDOWN]
    const touchEndEvents = [EVENTS.TOUCHEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP]
    const touchMoveEvents = [EVENTS.TOUCHMOVE, EVENTS.MOUSEMOVE]

    listener(touchStartEvents, element, touchStart)
    listener(touchEndEvents, element, touchEnd)
    listener(touchMoveEvents, element, touchMove)
  }
}
