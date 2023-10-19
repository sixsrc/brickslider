/* eslint-disable @typescript-eslint/no-explicit-any */
import { getSliderWidth } from "@/dom/methods/getSliderWidth"

export function $(element: string): HTMLElement {
  const selectedElement: HTMLElement | null = document.querySelector(element)
  if (!selectedElement) {
    throw new Error(`Element not found: ${element}`)
  }
  return selectedElement
}

export function listener(
  event: string,
  target: EventTarget,
  callback: EventListenerOrEventListenerObject
): void {
  target.addEventListener(event, callback)
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

/*export function calcTranslate(
  $children: HTMLElement,
  slideSpacing: number,
  slidePosition: number,
  slidesPerPage: number
): number {
  const marginDifference = slidePosition * slideSpacing
  const sliderWidth = getSliderWidth($children)
  const translate = -(sliderWidth * (slidePosition * slidesPerPage) + marginDifference)
  return translate
}*/

export function calcSlideWidth(slidesPerPage: number, spacing: number, sliderWidth: number) {
  const sliderWidthPercent = ((100 / slidesPerPage) * (1 - spacing / sliderWidth)).toFixed(2)

  return parseFloat(sliderWidthPercent)
}

/*export function waitFor(time: number, callback: () => void): void {
  setTimeout(callback, time)
}*/

export function waitFor(time: number, callback: () => void): NodeJS.Timeout {
  return setTimeout(() => {
    callback()
  }, time)
}

export function cancelWait(waitId: NodeJS.Timeout): void {
  clearTimeout(waitId)
}

type DebounceFunction = (...args: unknown[]) => void

export function debounce(func: any, delay: number): DebounceFunction {
  let timeoutId: NodeJS.Timeout

  return function (...args: unknown[]) {
    if (timeoutId) {
      cancelWait(timeoutId)
    }

    timeoutId = waitFor(delay, () => {
      func(...args)
    })
  }
}
