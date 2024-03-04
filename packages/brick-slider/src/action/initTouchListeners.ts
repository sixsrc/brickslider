import { listener } from "@/util"
import { EVENTS } from "@/util/constants"

export type TouchListenersParams = {
  element: HTMLElement
  index: number
  touchStart: EventListener
  touchEnd: EventListener
  touchMove: EventListener
}
export function initTouchListeners(params: TouchListenersParams): void {
  const { element, touchStart, touchEnd, touchMove } = params

  listener([EVENTS.TOUCHSTART, EVENTS.MOUSEDOWN], element, touchStart)
  listener(
    [EVENTS.TOUCHEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP],
    element,
    touchEnd
  )
  listener([EVENTS.TOUCHMOVE, EVENTS.MOUSEMOVE], element, touchMove)
}
