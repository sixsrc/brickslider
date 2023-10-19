import { setRealSlide } from "@/action/setRealSlide"
import { getChildren } from "@/core/functions/getChildren"
import { CLASS_VALUES } from "@/util/constants"
import { hasClass } from "@/dom/methods/hasClass"
import { getChildrenCount } from "@/dom/methods/getChildrenCount"
import { isFirstSlideCloned } from "./isFirstSlideCloned"
import { isLastSlideCloned } from "./isLastSlideCloned"

export function checkSlideCloned($root: string, slide: HTMLElement[]): void {
  const $children = getChildren($root)

  const numberOfSlides = getChildrenCount($children)

  const [first, last] = [isFirstSlideCloned($root, $children), isLastSlideCloned($root, $children)]

  type SlidesClonedType = {
    index: number
    jumpToIndex: number
    first?: boolean
    last?: boolean
  }

  const slidesCloned: SlidesClonedType[] = [
    { first, index: numberOfSlides - numberOfSlides, jumpToIndex: numberOfSlides - 2 },
    { last, index: numberOfSlides - 1, jumpToIndex: numberOfSlides - numberOfSlides + 1 }
  ]
  const isClonedIndex = slidesCloned.findIndex(
    (slide: SlidesClonedType) => slide.first || (slide.last as boolean)
  )

  if (isClonedIndex !== -1) {
    const isSlideCloned = true

    const { index, jumpToIndex } = slidesCloned[isClonedIndex]

    const isActiveClass = hasClass(slide[index], CLASS_VALUES.ACTIVE)

    const clonedSlide = slide[index]

    isSlideCloned && isActiveClass && setRealSlide($root, clonedSlide, jumpToIndex)
  }
}
