import { addClass } from "@/dom/methods/addClass"
import { appendChildren } from "@/dom/methods/appendChildren"
import { getFirstChildren } from "@/dom/methods/getFirstChildren"
import { getLastChildren } from "@/dom/methods/getLastChildren"
import { CLASS_VALUES } from "@/util/constants"

export function cloneSlides(selector: HTMLElement) {
  const firstSlide = getFirstChildren(selector) as HTMLElement,
    lastSlide = getLastChildren(selector) as HTMLElement

  selector.insertBefore(lastSlide.cloneNode(true) as HTMLElement, firstSlide)

  appendChildren(selector, [firstSlide.cloneNode(true) as HTMLElement])

  addClass([getFirstChildren(selector) as HTMLElement], "clonedFirst")

  addClass([getLastChildren(selector) as HTMLElement], "clonedLast")
}
