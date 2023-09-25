import { listener } from "../../../util"
import { EVENTS } from "../../../util/constants"

export type TouchListenersParams = {
  element: HTMLElement
  index: number
  touchStart: EventListener
  touchEnd: EventListener
  touchMove: EventListener
}
export function initTouchListeners(params: TouchListenersParams): void {
  const { element, touchStart, touchEnd, touchMove } = params
  listener(EVENTS.TOUCHSTART, element, touchStart)
  listener(EVENTS.TOUCHEND, element, touchEnd)
  listener(EVENTS.TOUCHMOVE, element, touchMove)
  listener(EVENTS.MOUSEDOWN, element, touchStart)
  listener(EVENTS.MOUSEUP, element, touchEnd)
  listener(EVENTS.MOUSELEAVE, element, touchEnd)
  listener(EVENTS.MOUSEMOVE, element, touchMove)
}
