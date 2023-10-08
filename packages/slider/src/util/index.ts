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
  slideMargin: number,
  slidePosition: number
): number {
  const marginDiference = slidePosition * slideMargin
  const sliderWidth = getSliderWidth($children)
  const translate = -(sliderWidth * slidePosition + marginDiference)
  return translate
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
