import { addClass } from "@/dom/methods/addClass"
import { appendChildren } from "@/dom/methods/appendChildren"
import { getFirstChildren } from "@/dom/methods/getFirstChildren"
import { getLastChildren } from "@/dom/methods/getLastChildren"
import { CLASS_VALUES, slideNodeList } from "@/util/constants"
import { getChildren } from "./getChildren"

/*export function cloneSlides(selector: HTMLElement) {
  const firstSlide = getFirstChildren(selector)
  const lastSlide = getLastChildren(selector)

  selector.insertBefore(lastSlide!.cloneNode(true), firstSlide)

  appendChildren(selector, [firstSlide!.cloneNode(true)! as HTMLElement])

  addClass(
    [getFirstChildren(selector)!, getLastChildren(selector)!],
    CLASS_VALUES.CLONED
  )
}*/

export function cloneSlides($root: string, slidesPerPage: number) {
  const selector = getChildren($root)
  const slides = slideNodeList($root)
  const slideCount = slides.length

  if (slideCount < slidesPerPage) {
    // Not enough slides to clone, do nothing.
    return
  }

  // Limit slidesPerPage to the maximum possible value.
  slidesPerPage = Math.min(slidesPerPage, slideCount)

  const clonedSlides: Node | (HTMLElement | Element)[] | null = []

  for (let i = 0; i < slidesPerPage; i++) {
    // Clone the first "slidesPerPage" slides and add them to the end.
    const clone = slides[i].cloneNode(true) as HTMLElement
    clonedSlides.push(clone)
    selector.appendChild(clone)
  }

  for (let i = slideCount - slidesPerPage; i < slideCount; i++) {
    // Clone the last "slidesPerPage" slides and add them to the beginning.
    const clone = slides[i].cloneNode(true) as HTMLElement
    clonedSlides.push(clone)
    selector.insertBefore(clone, slides[0])
  }

  // Add the CLONED class to the cloned slides.
  addClass(clonedSlides, CLASS_VALUES.CLONED)
}
