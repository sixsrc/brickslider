import { State, State_Keys } from "./State"
import { CLASS_VALUES, DOM_ELEMENTS, EVENTS } from "./constants"

type TypeIndexBaseSliderdBy = {
  from: string
  slideIndex: number
  touchIndex?: number
}

export function addClass(
  elements: (HTMLElement | Element)[],
  className: string
): void {
  elements.forEach(el => {
    el.classList.add(className)
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
  parent: HTMLElement,
  element: HTMLElement
): HTMLElement {
  if (parent) parent.appendChild(element)
  return element
}

export function attr(index: number, numberOfSlides: number) {
  return {
    "aria-label": `slide ${index} of ${numberOfSlides}`,
    "aria-hidden": "true",
    role: "group"
  }
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

export function getChildren(rootSelector: string): HTMLElement {
  return $(`${rootSelector}  ${DOM_ELEMENTS.CHILDREN_SELECTOR}`)
}

export function getChildrenCount(el: HTMLElement): number {
  return el.children.length
}

export function getDotsSelector($root: string): HTMLElement {
  return $(`${$root} ${DOM_ELEMENTS.DOTS_SELECTOR}`)
}

export function getElementAttribute(
  element: Element | HTMLElement,
  attributeName: string
): string | null {
  return element.getAttribute(attributeName)
}

export function getRootSelector($root: string): HTMLElement {
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

export function getSliderWidth(el: HTMLElement): number {
  return el.offsetWidth
}

export function getTrackChildren(rootSelector: string): HTMLElement {
  return $(`${rootSelector} ${DOM_ELEMENTS.TRACK_SELECTOR}`)
}

export function hasClass(el: HTMLElement, className: string): boolean {
  return el.classList.contains(className)
}

export function prependChild(
  parentEl: HTMLElement,
  childEl: HTMLElement
): void {
  parentEl.prepend(childEl)
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

export function setTransform(el: HTMLElement, fn: () => number): void {
  el.style.transform = `translate3d(${fn()}px, 0, 0)`
}

export function $(element: string): HTMLElement {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  if (!selectedElement) {
    throw new Error(`Element not found: ${element}`)
  }
  return selectedElement
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

  if (infinite) {
    index = setIndexBypass(i, numberOfSlides, slidesPerPage) + 1
    sliderCount = numberOfSlides - 2
  }

  index = i + 1
  sliderCount = numberOfSlides

  return { index, sliderCount }
}

export function calcSliderWidth(
  slidesPerPage: number,
  spacing: number,
  sliderWidth: number
) {
  const sliderWidthPercent = (
    (100 / slidesPerPage) *
    (1 - spacing / sliderWidth)
  ).toFixed(2)

  return parseFloat(sliderWidthPercent)
}

export function calcTranslate(
  $children: HTMLElement,
  slideSpacing: number,
  slidePosition: number
): number {
  const marginDiference = slidePosition * slideSpacing
  const sliderWidth = getSliderWidth($children)
  const translate = -(sliderWidth * slidePosition + marginDiference)

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

export function setIndexBypass(
  displayedIndex: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  slidesPerPage > 1
    ? (numberOfSlides = numberOfSlides - (slidesPerPage + slidesPerPage))
    : numberOfSlides

  const indexBypass =
    displayedIndex < 0
      ? numberOfSlides - 1
      : displayedIndex >= numberOfSlides
        ? displayedIndex
        : displayedIndex === numberOfSlides - 1
          ? 0
          : displayedIndex === 0
            ? numberOfSlides - 3
            : displayedIndex - 1

  return indexBypass
}

export function setTranslateX(
  $root: string,
  currentTranslateFixedValue: number
): number {
  const state = new State($root)
  const $children = getChildren($root)
  const { slideIndex, spacing } = State.store($root)
  const translate = calcTranslate($children, spacing, slideIndex),
    translateFixedValue = currentTranslateFixedValue!

  !currentTranslateFixedValue &&
    state.set({
      [State_Keys.PrevTranslate]: translate,
      [State_Keys.CurrentTranslate]: translate
    })

  return translateFixedValue ? translateFixedValue : translate
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

export function transform($root: string, currentTranslateFixed?: number) {
  const slider = getChildren($root)
  const callback = () => setTranslateX($root, currentTranslateFixed!)

  setTransform(slider, callback)
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

export function prevQueue(numberOfSlides: number, currentTranslate: number) {
  return [
    {
      [State_Keys.IsJumpSlide]: true,
      [State_Keys.SlideIndex]: 4,
      [State_Keys.CurrentTranslate]: -(Math.abs(currentTranslate) + 2352)
    },
    {
      //[State_Keys.CurrentTranslate]: -2352,
      // [State_Keys.PrevTranslate]: -2352
    }
  ]
}
