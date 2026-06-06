export const DOM_ELEMENTS = {
  CHILDREN_SELECTOR: ".bs-container",
  SINGLE_SLIDE: ".bs-slide",
  TRACK_SELECTOR: ".bs-track",
  DOTS_SELECTOR: ".bs-dots ",
  PROGRESS_SELECTOR: ".bs-progress",
  NEXT_BUTTON: "next-button",
  PREV_BUTTON: "prev-button",
  BRICK_ARROWS: ".bs-arrow"
}

export const DOM_ELEMENT_ALIASES = {
  TRACK: ["bs-track"],
  CHILDREN: ["bs-container"],
  SLIDE: ["bs-slide"],
  DOTS: ["bs-dots"],
  DOT: ["bs-dot"],
  DOT_ACTIVE: ["bs-dot--active"],
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

export const STYLES = {
  TRANSITION: "transition",
  PEEK: 0.8
}

export const TAGS = {
  UL: "ul",
  LI: "li",
  BUTTON: "button",
  DIV: "div"
}

export const FROM = {
  DOTS: "dots",
  RIGHT_CLICK: "contextmenu",
  PREV: "prev",
  NEXT: "next",
  TOUCH: "touch"
} as const

export const ATTRIBUTES = {
  ID: "id",
  TYPE: "type",
  TABINDEX: "tabindex",
  DATA_NUMBER: "data-slide-number",
  CLASS: "class",
  STYLE: "style",
  ARIA_LABEL: "aria-label",
  ARIA_HIDDEN: "aria-hidden",
  ARIA_LIVE: "aria-live",
  ARIA_ATOMIC: "aria-atomic",
  ARIA_CURRENT: "aria-current",
  ARIA_DISABLED: "aria-disabled",
  ARIA_CONTROLS: "aria-controls",
  ARIA_ROLEDESCRIPTION: "aria-roledescription",
  ROLE: "role",
  DRAGGABLE: "draggable",
  ARIA_VALUE_MIN: "aria-valuemin",
  ARIA_VALUE_MAX: "aria-valuemax",
  ARIA_VALUE_NOW: "aria-valuenow"
} as const

export const TIMES = {
  DEFAULT_TRANSITION_TIME: 500 //200
}

export const TRANSITIONS = {
  TRANSFORM_EASE: `transform ${TIMES.DEFAULT_TRANSITION_TIME}ms cubic-bezier(0.25,1,0.5,1)`
}

export const EVENTS = {
  RESIZE: "resize",
  CLICK: "click",
  KEYDOWN: "keydown",
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
} as const

export const ANIMATION_DELAY = 100

export const ANIMATION_OPTIONS = {
  FORWARDS: "forwards",
  EASEOUT: "ease-in-out"
} as const

export const TOUCH_LIMIT = 0

export const MOVE_TO_LIMIT = 3

export const POSITION = {
  RIGHT: "right",
  LEFT: "left"
} as const

export const SLIDE_INDEX = {
  FIRST: "first",
  LAST: "last"
} as const

export const DOCS = {
  GET_STARTED: "brickslider.github.io/docs/get-started",
  BASIC_HTML_DOC: "brickslider.github.io/docs/basic-html"
}

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
  options: any
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

export function shouldApplyAdjustment(
  totalSlides: number,
  slidesPerPage: number,
  clonedSlides: number
) {
  const totalPages = Math.ceil(totalSlides / slidesPerPage)

  const minimumClonesRequired = Math.max(
    slidesPerPage,
    totalSlides - slidesPerPage
  )

  return clonedSlides < minimumClonesRequired
}

export function calcNumberOfSlides(
  useLoop: boolean,
  slidesPerPage: number,
  $children: HTMLElement
) {
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

export function $(element: string): HTMLElement | undefined {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  return selectedElement ?? undefined
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

export function getRootSelector($root: string): HTMLElement | undefined {
  return $(`${$root}`)
}

export function getSliderNodeList($root: string, cloned: boolean = true) {
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

export function removeClass(
  el: HTMLElement,
  className: string | string[]
): void {
  const classNames = Array.isArray(className) ? className : [className]

  el.classList.remove(...classNames)
}

export function removePart<T extends string | any[]>(
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

export function setAttributes(element: HTMLElement, attributes: Object): void {
  for (const [key, value] of Object.entries(attributes)) {
    setAttribute(element, key, value)
  }
}

export function setInnerHTML(el: HTMLElement, html: string): void {
  el.innerHTML = html
}

export function getEventType(event: any): MouseEvent | Touch {
  if (event.type.includes("mouse")) {
    return event as MouseEvent
  } else {
    const touchEvent = event as TouchEvent
    return touchEvent.touches[0]
  }
}

export function getAxisX(event: any): number {
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

export function isAppleDevice(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return (
    ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")
  )
}

export function getSlideMovement(
  direction: typeof FROM.NEXT | typeof FROM.PREV
) {
  return direction === FROM.NEXT ? "increment" : "decrement"
}

export function indexBasedBy(params: any) {
  const { from, slideIndex, touchIndex } = params
  switch (from) {
    case "next":
      return slideIndex + 1
    case "prev":
      return slideIndex - 1
    case "dots":
    case "touchend":
      return touchIndex ?? slideIndex
    default:
      return slideIndex
  }
}

export function isNotMapped(
  useLoop: boolean,
  currentIndex: number,
  numberOfSlides: number
): boolean {
  if (!useLoop) {
    if (currentIndex < 0) return true
    if (currentIndex > numberOfSlides - 1) return true
  }
  return false
}

export function isValidSelector(string: string): boolean {
  const regex = /^[.#].*/
  return regex.test(string)
}

export function listener(
  events: string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  if (Array.isArray(events)) {
    events.forEach(event => {
      target.addEventListener(event, callback)
    })
  }
}

export function removeListener(
  events: string[],
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  if (Array.isArray(events)) {
    events.forEach(event => {
      target.removeEventListener(event, callback)
    })
  }
}

export function removeProperty(element: HTMLElement, prop: string) {
  element.style.removeProperty(prop)
}

export function removeAttribute(el: HTMLElement, attribute: string): void {
  el.removeAttribute(attribute)
}

export function reorderIdx(
  displayedIndex: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  slidesPerPage > 1
    ? (numberOfSlides = numberOfSlides - (slidesPerPage + slidesPerPage))
    : numberOfSlides

  const reorder =
    displayedIndex < 0
      ? numberOfSlides - 1
      : displayedIndex >= numberOfSlides
        ? displayedIndex
        : displayedIndex === numberOfSlides - 1
          ? 0
          : displayedIndex === 0
            ? numberOfSlides - 3
            : displayedIndex - 1

  return reorder
}

export function updateDataIndexes(
  slides: HTMLElement[],
  slidesPerPage: number
) {
  let groupIndex = 0

  slides.forEach((slide, index) => {
    const isStartOfGroup = index % slidesPerPage === 0

    if (isStartOfGroup && index !== 0) {
      groupIndex++
    }

    slide.setAttribute("data-index", String(groupIndex))
  })
}

export function shouldChangePage(
  allSlides: Record<number, number[]>,
  activeSlides: Record<number, number[]>
): boolean {
  for (const page in activeSlides) {
    const activeGroup = activeSlides[page]

    for (const group in allSlides) {
      const allGroup = allSlides[group]

      const isEqual =
        activeGroup.length === allGroup.length &&
        activeGroup.every(value => allGroup.includes(value))

      if (isEqual) {
        return true
      }
    }
  }

  return false
}
export function toggleClass2(
  slides: HTMLElement[],
  slidesPerView: number,
  slidesPerPage: number,
  slideMovement: any
): Map<number, number[]> {
  if (slidesPerView > slidesPerPage) {
    slidesPerView = slidesPerPage
  }

  let activeStartIndex = -1
  let activeEndIndex = -1

  slides.forEach((slide, index) => {
    if (slide.classList.contains(CLASS_VALUES.ACTIVE)) {
      if (activeStartIndex === -1) {
        activeStartIndex = index
      }
      activeEndIndex = index
    }
  })

  slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))

  let targetStartIndex: number

  if (slideMovement === "increment") {
    targetStartIndex = activeStartIndex + slidesPerView
  } else {
    targetStartIndex = activeStartIndex - slidesPerView
  }

  targetStartIndex = Math.max(
    0,
    Math.min(slides.length - slidesPerPage, targetStartIndex)
  )

  const activeSlidesMap = new Map<number, number[]>()
  const activeIndices: number[] = []

  for (let i = 0; i < slidesPerPage; i++) {
    const index = targetStartIndex + i
    if (index < slides.length) {
      addClass([slides[index]], CLASS_VALUES.ACTIVE)
      activeIndices.push(index)
    }
  }

  const currentPage = Math.floor(targetStartIndex / slidesPerPage) + 1
  activeSlidesMap.set(currentPage, activeIndices)

  return activeSlidesMap
}

export function toggleClass(
  slides: HTMLElement[],
  slideIndex: number,
  slidesPerPage: number
): void {
  let i = 0

  slides.forEach(slide => {
    removeClass(slide, CLASS_VALUES.ACTIVE)
  })

  for (i; i < slidesPerPage; i++) {
    const index = slideIndex * slidesPerPage + i

    addClass([slides[index]], CLASS_VALUES.ACTIVE)
  }
}

export function translate3d(x: number): string | undefined {
  return `translate3d(${x}px, 0px, 0px)`
}

export function isSafariBrowser() {
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  return isSafari
}

export function waitUntil<T>(
  predicate: () => T | false,
  interval = 16,
  timeout = 2000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const start = performance.now()

    const check = () => {
      const result = predicate()
      if (result) {
        resolve(result)
      } else if (performance.now() - start > timeout) {
        reject(new Error("Timeout"))
      } else {
        setTimeout(check, interval)
      }
    }

    check()
  })
}

export function waitFor(time: number, callback: () => void) {
  let start: number

  function wait(timestamp: number) {
    if (!start) start = timestamp
    if (timestamp - start < time) {
      requestAnimationFrame(wait)
    } else {
      callback()
    }
  }
  requestAnimationFrame(wait)
}
