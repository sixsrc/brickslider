import { addClass } from "@/dom/methods/addClass"
import { appendChildren } from "@/dom/methods/appendChildren"
import { getFirstChildren } from "@/dom/methods/getFirstChildren"
import { getLastChildren } from "@/dom/methods/getLastChildren"
import { CLASS_VALUES } from "@/util/constants"

export function cloneSlides(selector: HTMLElement) {
  const firstSlide = getFirstChildren(selector)
  const lastSlide = getLastChildren(selector)

  selector.insertBefore(lastSlide!.cloneNode(true), firstSlide)

  appendChildren(selector, [firstSlide!.cloneNode(true)! as HTMLElement])

  addClass([getFirstChildren(selector)!, getLastChildren(selector)!], CLASS_VALUES.CLONED)
}
