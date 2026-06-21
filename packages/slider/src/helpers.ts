import type { MouseEventOrTouchEvent, UpdateSlideIndexType } from "./types"

export const DOM_ELEMENT_ALIASES = {
  TRACK: ["bs-track"],
  CHILDREN: ["bs-container"],
  SLIDE: ["bs-slide"],
  DOTS: ["bs-dots"],
  DOT: ["bs-dot"],
  DOT_ACTIVE: ["bs-dot--active"],
  PAGES: ["bs-pages"],
  PROGRESS: ["bs-progress"],
  PROGRESS_BAR: ["bs-progress-bar"],
  ARROW: ["bs-arrow"],
  ARROW_PREV: ["bs-prev"],
  ARROW_NEXT: ["bs-next"],
  HIDDEN: ["bs-hidden"],
  DESTROYED: ["bs-destroyed"]
} as const

export const CLASS_VALUES = {
  ACTIVE: "active",
  SLIDER_DOT: "bs-dot",
  SELECTED: "bs-dot--active",
  CLONED: "cloned",
  HIDE: "bs-hidden",
  START: "start",
  END: "end"
}

export const TAGS = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div",
  SPAN: "span",
  STYLE: "style",
  VIDEO: "video"
}

export const FROM = {
  DOTS: "dots",
  RIGHT_CLICK: "contextmenu",
  PREV: "prev",
  NEXT: "next",
  TOUCH: "touch",
  TOUCHEND: "touchend"
} as const

export const ATTRIBUTES = {
  ID: "id",
  TYPE: "type",
  TABINDEX: "tabindex",
  DATA_INDEX: "data-index",
  DATA_NUMBER: "data-slide-number",
  DATA_PROGRESS_SYNCED_AT: "data-progress-synced-at",
  CLASS: "class",
  STYLE: "style",
  ARIA_LABEL: "aria-label",
  ARIA_HIDDEN: "aria-hidden",
  ARIA_LIVE: "aria-live",
  ARIA_ATOMIC: "aria-atomic",
  ARIA_CURRENT: "aria-current",
  ARIA_DISABLED: "aria-disabled",
  ARIA_CONTROLS: "aria-controls",
  ARIA_MODAL: "aria-modal",
  ARIA_ROLEDESCRIPTION: "aria-roledescription",
  ROLE: "role",
  DISABLED: "disabled",
  DRAGGABLE: "draggable",
  ARIA_VALUE_MIN: "aria-valuemin",
  ARIA_VALUE_MAX: "aria-valuemax",
  ARIA_VALUE_NOW: "aria-valuenow"
} as const

export const TIMES = {
  DEFAULT_TRANSITION_TIME: 560,
  FAST_TRANSITION_TIME: 220,
  MULTI_PAGE_TRANSITION_TIME: 400,
  LARGE_PAGE_TRANSITION_TIME: 280,
  FAST_MULTI_PAGE_TRANSITION_TIME: 220,
  DRAG_FREE_RELEASE_TIME: 1500,
  FAST_NAVIGATION_OFFSET: 100,
  ARROW_NAVIGATION_GUARD: 0,
  TOUCH_NAVIGATION_GUARD: 350,
  PROGRESS_TRANSITION_TIME: 560,
  SWIPE_MOUSE_LEAVE_DELAY: 100
}

export const EVENTS = {
  RESIZE: "resize",
  CLICK: "click",
  POINTERDOWN: "pointerdown",
  POINTERUP: "pointerup",
  POINTERCANCEL: "pointercancel",
  KEYDOWN: "keydown",
  TOUCHSTART: "touchstart",
  TOUCHEND: "touchend",
  TOUCHMOVE: "touchmove",
  MOUSEDOWN: "mousedown",
  MOUSEUP: "mouseup",
  MOUSELEAVE: "mouseleave",
  MOUSEENTER: "mouseenter",
  MOUSEMOVE: "mousemove",
  CONTEXTMENU: "contextmenu",
  TRANSITIONSTART: "transitionstart",
  TRANSITIONEND: "transitionend",
  TRANSITIONCANCEL: "transitioncancel",
  DRAGSTART: "dragstart",
  DRAGOVER: "dragover",
  DRAGEND: "dragend"
} as const

export const SLIDER_EVENTS = {
  MOUNTED: "mounted",
  DESTROYED: "destroyed",
  SLIDE_CHANGE: "slideChange"
} as const

export const ANIMATION_OPTIONS = {
  FORWARDS: "forwards",
  LINEAR: "linear",
  EASEOUT: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  DRAG_FREE_EASING: "cubic-bezier(0.22, 1, 0.36, 1)"
} as const

export const RESPONSIVE_BREAKPOINTS = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl"
] as const

export const NORMALIZED_ELEMENT_ROLES = {
  TRACK: "track",
  CHILDREN: "children",
  SLIDE: "slide",
  ARROW: "bs-arrow",
  PAGES: "bs-pages"
} as const

export const INTERNAL_SELECTORS = {
  PLUGIN_ROOT_PLACEHOLDER: "#__brickslider_plugin_root__"
} as const

export const TOUCH_LIMIT = 0

export const MOVE_TO_LIMIT = 3

export const TOUCH_CONFIG = {
  FAST_SWIPE_MAX_MS: 180,
  FAST_VELOCITY_THRESHOLD: 0.35,
  SLOW_LIMIT: 35,
  MAX_LIMIT: 55,
  DRAG_FREE_SETTLE_FACTOR: 0.12
} as const

export const POSITION = {
  RIGHT: "right",
  LEFT: "left"
} as const

export const DOCS = {
  GET_STARTED: "https://sixsrc.github.io/brickslider/docs/quick-start/",
  BASIC_HTML_DOC: "https://sixsrc.github.io/brickslider/docs/basic-markup/"
} as const

export const BASIC_DOCS = `See: ${DOCS.BASIC_HTML_DOC}`

export const START_DOCS = `See: ${DOCS.GET_STARTED}`

export const ERROR_IDS = new Set([
  "NO_ROOT",
  "NO_TRACK",
  "NO_CHILDREN",
  "NO_SLIDES",
  "DUPLICATE_ELEMENTS",
  "INVALID_ORDER"
])

export function addClass(
  elements: (HTMLElement | Element)[],
  className: string
): void {
  elements.forEach(el => {
    el.classList.add(className)
  })
}

export function animateElement(
  element: HTMLElement | HTMLElement[],
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions
): Animation[] {
  if (!element) {
    throw new Error("Element is required for animation.")
  }

  const elements = Array.isArray(element) ? element : [element]

  return elements.map(el => el.animate(keyframes, options))
}

export function appendToParent(
  parent: HTMLElement | undefined,
  element: HTMLElement | undefined
): HTMLElement | undefined {
  if (parent && element) {
    parent.appendChild(element)
    return element
  }
}

export function insertBefore(
  parent: HTMLElement | undefined,
  element: HTMLElement | undefined,
  referenceElement: HTMLElement | undefined
): HTMLElement | undefined {
  if (parent && element && referenceElement) {
    parent.insertBefore(element, referenceElement)
    return element
  }
}

export function removeElement(
  element: HTMLElement | Element | null | undefined
): void {
  element?.remove()
}

export function calcNumberOfSlides(
  useLoop: boolean,
  slidesPerPage: number,
  $children: HTMLElement
): number {
  const sliderCount = getChildrenCount($children)

  if (useLoop && slidesPerPage <= 1) {
    return sliderCount - 2
  }
  if (useLoop && slidesPerPage > 1) {
    return Math.ceil(sliderCount / slidesPerPage) - slidesPerPage
  }
  if (!useLoop && slidesPerPage > 1) {
    return Math.ceil(sliderCount / slidesPerPage)
  }
  return sliderCount
}

export function createNewElement(tagName: string): HTMLElement {
  return document.createElement(tagName)
}

export function getAllElements<T extends Element>(
  selector: string,
  parent: Document | Element = document
): NodeListOf<T> {
  return parent.querySelectorAll(selector) as NodeListOf<T>
}

export function getElement<T extends Element>(
  selector: string,
  parent: Document | Element = document
): T | undefined {
  const selectedElement = parent.querySelector(selector) as T | null

  return selectedElement ?? undefined
}

export function $(element: string): HTMLElement | undefined {
  return getElement<HTMLElement>(element)
}

export function getDotsContainer(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector} .${DOM_ELEMENT_ALIASES.DOTS[0]}`)
}

export function getProgressContainer(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector} .${DOM_ELEMENT_ALIASES.PROGRESS[0]}`)
}

export function getChildren(rootSelector: string): HTMLElement | undefined {
  return $(`${rootSelector} .${DOM_ELEMENT_ALIASES.CHILDREN[0]}`)
}

export function getChildrenCount(el: HTMLElement | undefined): number {
  return el ? el!.children.length : 0
}

export function getDotsSelector($root: string): HTMLElement | undefined {
  return $(`${$root} .${DOM_ELEMENT_ALIASES.DOTS[0]}`)
}

export function getPagesContainer(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector} .${DOM_ELEMENT_ALIASES.PAGES[0]}`)
}

export function getRootSelector($root: string): HTMLElement | undefined {
  return $(`${$root}`)
}

export function getSliderNodeList(
  $root: string,
  cloned: boolean = true
): HTMLElement[] {
  const slideSelectors = `:scope > .${DOM_ELEMENT_ALIASES.SLIDE[0]}${cloned ? "" : ":not(.cloned)"}`

  return Array.from(
    getAllElements<HTMLElement>(slideSelectors, getChildren($root))
  )
}

export function getSliderWidth(
  el: HTMLElement | undefined
): number | undefined {
  if (el) return el.offsetWidth
}

export function getTrackChildren(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector} .${DOM_ELEMENT_ALIASES.TRACK[0]}`)
}

export function hasClass(el: HTMLElement, className: string): boolean {
  return el.classList.contains(className)
}

export function containsElement(
  parent: HTMLElement | undefined | null,
  child: Node | null | undefined
): boolean {
  if (!parent || !child) return false

  return parent.contains(child)
}

export function closestElement(
  element: Element | null | undefined,
  selector: string
): HTMLElement | undefined {
  if (!element) return undefined

  return (element.closest(selector) as HTMLElement | null) ?? undefined
}

export function hasAttribute(
  el: HTMLElement | undefined | null,
  attribute: string
): boolean {
  if (!el) return false

  return el.hasAttribute(attribute)
}

export function getAttribute(
  el: HTMLElement | undefined | null,
  attribute: string
): string | null {
  if (!el) return null

  return el.getAttribute(attribute)
}

export function removeClass(
  el: HTMLElement,
  className: string | string[]
): void {
  const classNames = Array.isArray(className) ? className : [className]

  el.classList.remove(...classNames)
}

export function removePart<T extends string | unknown[]>(
  input: T,
  start?: number,
  end?: number
): T {
  return input.slice(start, end) as T
}

export function setAttribute(
  el: HTMLElement,
  attribute: string,
  value: string
): void {
  el.setAttribute(attribute, value)
}

export function setAttributes(
  element: HTMLElement,
  attributes: Record<string, string | number | boolean>
): void {
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(element, key, String(value))
  }
}

export function getEventType(
  event: MouseEventOrTouchEvent
): MouseEvent | Touch {
  if (event.type.includes("mouse")) {
    return event as MouseEvent
  } else {
    const touchEvent = event as TouchEvent
    return touchEvent.touches[0]
  }
}

export function isPrimaryInputButton(event: MouseEventOrTouchEvent): boolean {
  if (event instanceof MouseEvent) {
    return event.button === 0
  }

  return true
}

export function getAxisX(event: MouseEventOrTouchEvent): number {
  if (event.type.includes("mouse")) {
    return (event as MouseEvent).pageX
  } else if (
    (event as TouchEvent).touches &&
    (event as TouchEvent).touches.length > 0
  ) {
    return (event as TouchEvent).touches[0].clientX
  } else {
    return NaN
  }
}

export function getSlideMovement(
  direction: typeof FROM.NEXT | typeof FROM.PREV
): UpdateSlideIndexType {
  return direction === FROM.NEXT ? "increment" : "decrement"
}

export function isValidSelector(string: string): boolean {
  const regex = /^[.#].*/
  return regex.test(string)
}

export function listener(
  events: string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject | ((event: any) => void),
  options?: boolean | AddEventListenerOptions
): void {
  if (Array.isArray(events)) {
    events.forEach(event => {
      target.addEventListener(event, callback as EventListener, options)
    })
  }
}

export function removeListener(
  events: string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject | ((event: any) => void),
  options?: boolean | EventListenerOptions
): void {
  if (Array.isArray(events)) {
    events.forEach(event => {
      target.removeEventListener(event, callback as EventListener, options)
    })
  }
}

export function removeAttribute(el: HTMLElement, attribute: string): void {
  el.removeAttribute(attribute)
}

export function translate3d(x: number): string {
  return `translate3d(${x}px, 0px, 0px)`
}

export function waitFor(time: number, callback: () => void): void {
  let start: number

  function wait(timestamp: number): void {
    if (!start) start = timestamp
    if (timestamp - start < time) {
      requestAnimationFrame(wait)
    } else {
      callback()
    }
  }

  requestAnimationFrame(wait)
}
