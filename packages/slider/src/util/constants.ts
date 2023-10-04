import { getChildren } from "@/core/functions/getChildren"
import { getAllElements } from "@/dom/methods/getAllElements"

export const DOM_ELEMENTS = {
  CHILDREN_SELECTOR: ".slider__container",
  DOTS_SELECTOR: ".slider__dots ",
  NEXT_BUTTON: "next-button",
  PREV_BUTTON: "prev-button",
  BRICK_ARROWS: "brick-arrows"
}

export const STYLES = {
  TRANSITION: "transition"
}

export const TAGS = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div"
}

export const PROPERTYS_VALUES = {
  VISIBLE: "visible",
  HIDDEN: "hidden"
}

export const CLASS_VALUES = {
  ACTIVE: "active",
  SLIDER_DOT: "slider__dot",
  SELECTED: "slider__dot--active",
  CLONED: "cloned"
}

export const ATTRIBUTES = {
  CLASS: "class",
  ARIA_HIDDEN: "aria-hidden",
  ROLE: "role",
  DIRECTION: "data-direction"
}

export const PROPERTYS = {
  VISIBILITY: "visibility"
}

//"transform 0.2s ease"
//cubic-bezier(0.25,1,0.5,1)

// `transform 0.3s`

export const TIMES = {
  DEFAULT_TRANSITION_TIME: 200
}
//`transform ${TIMES.DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.25,1,0.5,1)`
export const TRANSITIONS = {
  TRANSFORM_EASE: `transform ${TIMES.DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.25,1,0.5,1)`
}

export const EVENTS = {
  RESIZE: "resize",
  CLICK: "click",
  TOUCHSTART: "touchstart",
  TOUCHEND: "touchend",
  TOUCHMOVE: "touchmove",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSELEAVE: "mouseleave",
  MOUSEMOVE: "mousemove",
  TRANSITIONEND: "transitionend"
}

export const TOUCH_LIMIT_SPEED = 150

export const THRESHOLD_LIMIT = 150

export const eventX = (event: MouseEvent | TouchEvent) =>
  event.type.includes("mouse") ? (event as MouseEvent) : (event as TouchEvent)

export const dotsSelector = DOM_ELEMENTS.DOTS_SELECTOR

export const childrenSelector = DOM_ELEMENTS.CHILDREN_SELECTOR

export const slideNodeList = ($root: string) =>
  Array.from(getAllElements<HTMLElement>(`${childrenSelector} > *`, getChildren($root)))
