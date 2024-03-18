export const DOM_ELEMENTS = {
  CHILDREN_SELECTOR: ".slider__container",
  TRACK_SELECTOR: ".slider__track",
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

export const FROM = {
  DOTS: "dots",
  PREV: "prev",
  NEXT: "next",
  TOUCH: "touch"
} as const

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

export const TIMES = {
  DEFAULT_TRANSITION_TIME: 400
}

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
  TRANSITIONSTART: "transitionstart",
  TRANSITIONEND: "transitionend"
}
