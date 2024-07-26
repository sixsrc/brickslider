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
  DIRECTION: "data-direction",
  DRAGGABLE: "draggable"
} as const

export const TIMES = {
  DEFAULT_TRANSITION_TIME: 500
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
  CONTEXTMENU: "contextmenu",
  TRANSITIONSTART: "transitionstart",
  TRANSITIONEND: "transitionend",
  TRANSITIONCANCEL: "transitioncancel",
  DRAGSTART: "dragstart",
  DRAGOVER: "dragover",
  DRAGEND: "dragend"
}

export const ANIMATION_DELAY = 100

export const ANIMATION_OPTIONS = {
  FORWARDS: "forwards",
  EASEOUT: "ease"
} as const

//velocidade maior sem sair do elemento diminui tolencia TOUCH_LIMIT = 10 MOVE_TO_LIMIT = 5
//velocidade maior diminui saindo do elemento tolencia TOUCH_LIMIT = 50 MOVE_TO_LIMIT = 55
export const TOUCH_LIMIT = 20 //5

export const MOVE_TO_LIMIT = 3

export const POSITION = {
  RIGHT: "right",
  LEFT: "left"
} as const

export const SLIDE_INDEX = {
  FIRST: "first",
  SECOND: "second",
  LAST: "last"
} as const
