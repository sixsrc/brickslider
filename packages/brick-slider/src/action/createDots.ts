import {
  addClass,
  appendToParent,
  createNewElement,
  getChildren,
  getChildrenCount
} from "@/dom"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES, TAGS } from "@/util/constants"

export function createDots($root: string, containerDots: HTMLElement): void {
  const state = new State($root),
    { slidesPerPage } = state.store

  const isInfinite = state.get(State_Keys.Infinite),
    $children = getChildren($root),
    slidesCount = getChildrenCount($children)

  if (isInfinite && slidesPerPage <= 1)
    state.set(State_Keys.NumberOfSlides, slidesCount - 2)

  if (isInfinite && slidesPerPage > 1)
    state.set(
      State_Keys.NumberOfSlides,
      Math.ceil(slidesCount / slidesPerPage) - slidesPerPage
    )

  if (!isInfinite && slidesPerPage > 1) {
    state.set(State_Keys.NumberOfSlides, Math.ceil(slidesCount / slidesPerPage))
  }

  const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  for (let i = 0; i < numberOfSlides; i++) {
    const liDots = createNewElement(TAGS.LI)

    appendToParent(containerDots, liDots)

    addClass([liDots], CLASS_VALUES.SLIDER_DOT)

    if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
  }
}
