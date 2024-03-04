import { addClass, getChildren } from "@/dom"
import { slideNodeList, constants } from "@/util"
import { CLASS_VALUES } from "@/util/constants"

export function cloneSlides($root: string, slidesPerPage: number) {
  const selector = getChildren($root),
    slides = slideNodeList($root),
    slideCount = slides.length

  if (slideCount < slidesPerPage) return

  slidesPerPage = Math.min(slidesPerPage, slideCount)

  const clonedSlides: Node | (HTMLElement | Element)[] | null = []

  for (let i = 0; i < slidesPerPage; i++) {
    const clone = slides[i].cloneNode(true) as HTMLElement

    clonedSlides.push(clone)
    selector.appendChild(clone)
  }

  for (let i = slideCount - slidesPerPage; i < slideCount; i++) {
    const clone = slides[i].cloneNode(true) as HTMLElement

    clonedSlides.push(clone)
    selector.insertBefore(clone, slides[0])
  }

  addClass(clonedSlides, CLASS_VALUES.CLONED)
}
