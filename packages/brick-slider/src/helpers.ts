import { CLASS_VALUES, DOM_ELEMENTS } from "./constants"
import {
  AnimationOptions,
  DirectionType,
  TypeIndexBaseSliderdBy
} from "./types"

/*export function addClass(
  elements: (HTMLElement | Element)[],
  className: string
): void {
  elements.forEach(el => {
    el.classList.add(className)
  })
}*/

export function addClass(
  elements: HTMLElement | Element | (HTMLElement | Element)[],
  className: string
): void {
  if (!Array.isArray(elements)) {
    elements = [elements]
  }
  elements.forEach(el => {
    el.classList.add(className)
  })
}
export function animateElement(
  element: HTMLElement | HTMLElement[],
  keyframes: Keyframe[],
  options: Partial<AnimationOptions>
): void {
  if (!element) {
    throw new Error("Element is required for animation.")
  }

  const elements = Array.isArray(element) ? element : [element]

  elements.forEach(el => {
    el.animate(keyframes, options)
  })
}

export function appendChildren(
  container: HTMLElement,
  children: HTMLElement[]
): void {
  children.forEach(element => container.appendChild(element))
}
export function applyCss(
  element: HTMLElement,
  styles: { [style: string]: string }
): void {
  Object.keys(styles).forEach(key =>
    element.style.setProperty(key, styles[key])
  )
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

export function calcNumberOfSlides(
  infinite: boolean,
  slidesPerPage: number,
  $children: HTMLElement
) {
  const sliderCount = getChildrenCount($children)

  if (infinite && slidesPerPage <= 1) {
    return sliderCount - 2
  }
  if (infinite && slidesPerPage > 1) {
    return Math.ceil(sliderCount / slidesPerPage) - slidesPerPage
  }
  if (!infinite && slidesPerPage > 1) {
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

export function getChildren(rootSelector: string): HTMLElement | undefined {
  return $(`${rootSelector}  ${DOM_ELEMENTS.CHILDREN_SELECTOR}`)
}

export function getChildrenCount(el: HTMLElement | undefined): number {
  return el!.children.length
}

export function getDotsSelector($root: string): HTMLElement | undefined {
  return $(`${$root} ${DOM_ELEMENTS.DOTS_SELECTOR}`)
}

export function getElementAttribute(
  element: Element | HTMLElement,
  attributeName: string
): string | null {
  return element.getAttribute(attributeName)
}

export function getRootSelector($root: string): HTMLElement | undefined {
  return $(`${$root}`)
}

export function getSliderNodeList($root: string) {
  return Array.from(
    getAllElements<HTMLElement>(
      `${DOM_ELEMENTS.CHILDREN_SELECTOR} > *`,
      getChildren($root)
    )
  )
}

export function getSliderWidth(
  el: HTMLElement | undefined
): number | undefined {
  if (el) return el.offsetWidth
}

export function getFastInteraction(doubleTapMs: number) {
  let timeout: number | NodeJS.Timeout = 0
  let lastTap = 0

  return function handleFastInteraction(event: any) {
    const currentTime = new Date().getTime()
    const tapLength = currentTime - lastTap
    if (0 < tapLength && tapLength < doubleTapMs) {
      event.preventDefault()
      const doubleTap = new CustomEvent("doubletap", {
        bubbles: true,
        detail: event
      })
      event.target.dispatchEvent(doubleTap)
    } else {
      timeout = setTimeout(() => clearTimeout(timeout), doubleTapMs)
    }
    lastTap = currentTime
  }
}

export function getTouchDirection(
  currentPosition: number,
  startPos: number
): DirectionType {
  return currentPosition - startPos > 0 ? { right: true } : { left: true }
}

export function getTrackChildren(
  rootSelector: string
): HTMLElement | undefined {
  return $(`${rootSelector} ${DOM_ELEMENTS.TRACK_SELECTOR}`)
}

export function hasClass(el: HTMLElement, className: string): boolean {
  return el.classList.contains(className)
}

export function prependChild(
  parentEl: HTMLElement | undefined,
  childEl: HTMLElement
): void {
  parentEl?.prepend(childEl)
}

export function removeClass(el: HTMLElement, className: string): void {
  el.classList.remove(className)
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

export function setStyle(el: HTMLElement, styleProp: any, value: string): void {
  el.style[styleProp] = value
}

export function $(element: string): HTMLElement | undefined {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  if (selectedElement) {
    return selectedElement
  }
}

export function adjustIndex(index: number, slidesPerPage: number) {
  if (slidesPerPage > 1) return Math.floor(index / slidesPerPage)
  return index
}

export function assert(condition: boolean, message?: string): void {
  if (!condition) {
    throw new Error(` ${message || ""}`)
  }
}

export function calcIndex(
  infinite: boolean,
  i: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  let index: number
  let sliderCount: number

  index = i + 1
  sliderCount = numberOfSlides

  if (infinite) {
    ///setIndexBypass(i, numberOfSlides, slidesPerPage) + 1
    sliderCount = numberOfSlides - 2
  }

  // index = i + 1
  return { index, sliderCount }
}

/*export function calcIndex(
  infinite: boolean,
  i: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  let index: number
  let sliderCount: number

  index = i + 1
  sliderCount = numberOfSlides

 

  if (infinite) {
    index = setIndexBypass(i, numberOfSlides, slidesPerPage) + 1
    sliderCount = numberOfSlides
  }

  return { index, sliderCount }
}*/

/*export function calcIndex(
  infinite: boolean,
  i: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  let index: number
  let sliderCount: number

  index = i + 1
  sliderCount = numberOfSlides

  if (infinite) {
    const numberOfRealSlides = numberOfSlides - slidesPerPage * 2
    index = i + 1
    sliderCount = numberOfRealSlides
  }

  return { index, sliderCount }
}*/

export function calcSliderWidth(spacing: number, sliderWidth: number) {
  return sliderWidth + spacing
}

export function calcTranslate(
  $children: HTMLElement,
  slideSpacing: number,
  slidePosition: number
): number {
  const marginDiference = slidePosition * slideSpacing
  const sliderWidth = getSliderWidth($children)
  const translate = -(sliderWidth! * slidePosition + marginDiference)

  return translate
}

export const eventX = (event: MouseEvent | TouchEvent) =>
  event.type.includes("mouse") ? (event as MouseEvent) : (event as TouchEvent)

export function getAxisX(event: MouseEvent | TouchEvent): number {
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

export function indexBasedBy(params: TypeIndexBaseSliderdBy) {
  const { from, slideIndex, touchIndex } = params
  switch (from) {
    case "next":
      return slideIndex + 1
    case "prev":
      return slideIndex - 1
    case "dots":
    case "touch":
      return touchIndex ?? slideIndex
    default:
      return slideIndex
  }
}

export function isNotMapped(
  infinite: boolean,
  currentIndex: number,
  numberOfSlides: number
): boolean {
  switch (true) {
    case !infinite && currentIndex > numberOfSlides - 1:
      return true
    case !infinite && currentIndex < 0:
      return true
    case currentIndex > currentIndex + 1:
      currentIndex = currentIndex - 1
      break
    case currentIndex < 0:
      currentIndex = currentIndex + 1
      break
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

export function reorderIndex(
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

export function translate3d(x: number): string {
  return `translate3d(${x}px, 0px, 0px)`
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
