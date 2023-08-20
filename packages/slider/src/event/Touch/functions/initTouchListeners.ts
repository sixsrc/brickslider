import { listener } from "../../../util";
import { EVENTS } from "../../../util/constants";
import { TouchListenersParams } from "../TouchListenersParams";

export function initTouchListeners(params: TouchListenersParams): void {
  const { /* slideImage,*/ element, touchStart, touchEnd, touchMove } = params;

  //slideImage.addEventListener("dragstart", (e: Event) => e.preventDefault());
  /* element.addEventListener("touchstart", touchStart);
  element.addEventListener("touchend", touchEnd);
  element.addEventListener("touchmove", touchMove);
  element.addEventListener("mousedown", touchStart);
  element.addEventListener("mouseup", touchEnd);
  element.addEventListener("mouseleave", touchEnd);
  element.addEventListener("mousemove", touchMove);*/

  listener(EVENTS.TOUCHSTART, element, touchStart);
  listener(EVENTS.TOUCHEND, element, touchEnd);
  listener(EVENTS.TOUCHMOVE, element, touchMove);
  listener(EVENTS.MOUSEDOWN, element, touchStart);
  listener(EVENTS.MOUSEUP, element, touchEnd);
  listener(EVENTS.MOUSELEAVE, element, touchEnd);
  listener(EVENTS.MOUSEMOVE, element, touchMove);
}
