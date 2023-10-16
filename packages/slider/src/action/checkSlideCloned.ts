import { setRealSlide } from "@/action/setRealSlide"
import { getChildren } from "@/core/functions/getChildren"
import { CLASS_VALUES } from "@/util/constants"
import { hasClass } from "@/dom/methods/hasClass"
import { getChildrenCount } from "@/dom/methods/getChildrenCount"
import { isFirstSlideCloned } from "./isFirstSlideCloned"
import { isLastSlideCloned } from "./isLastSlideCloned"
import { State, State_Keys } from "@/state/BrickState"

export function checkSlideCloned($root: string, slide: HTMLElement[]): void {
  const $children = getChildren($root)

  ///const state = new State($root)

  console.log("check")

  const countSlides = getChildrenCount($children)

  const [first, last] = [isFirstSlideCloned($root, $children), isLastSlideCloned($root, $children)]

  type SlidesClonedType = {
    index: number
    jumpToIndex: number
    first?: boolean
    last?: boolean
  }

  const slidesCloned: SlidesClonedType[] = [
    { first, index: countSlides - countSlides, jumpToIndex: countSlides - 2 },
    { last, index: countSlides - 1, jumpToIndex: countSlides - countSlides + 1 }
  ]
  const isClonedIndex = slidesCloned.findIndex(
    (slide: SlidesClonedType) => slide.first || (slide.last as boolean)
  )

  if (isClonedIndex !== -1) {
    const isSlideCloned = true

    const { index, jumpToIndex } = slidesCloned[isClonedIndex]

    const isActiveClass = hasClass(slide[index], CLASS_VALUES.ACTIVE)

    const clonedSlide = slide[index]

    // !isSlideCloned && !isActiveClass && state.set(State_Keys.isStopSlider, false)

    isSlideCloned && isActiveClass && setRealSlide($root, clonedSlide, jumpToIndex)
  }
}
