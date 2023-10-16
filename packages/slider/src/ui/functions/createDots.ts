import { addClass } from "../../dom/methods/addClass"
import { appendToParent } from "../../dom/methods/appendToParent"
import { createNewElement } from "../../dom/methods/createNewElement"
import { CLASS_VALUES, TAGS } from "../../util/constants"
import { State, State_Keys } from "@/state/BrickState"
import { getChildrenCount } from "@/dom/methods/getChildrenCount"
import { getChildren } from "@/core/functions/getChildren"

export function createDots($root: string, containerDots: HTMLElement): void {
  const state = new State($root)

  const isInfinite = state.get(State_Keys.Infinite)

  const $children = getChildren($root)

  const slidesCount = getChildrenCount($children)

  const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  if (isInfinite) state.set(State_Keys.NumberOfSlides, slidesCount - 2)

  if (slidesPerPage > 1) {
    //console.log("teste", Math.ceil((slidesCount - 2) / 2))
    state.set(State_Keys.NumberOfSlides, Math.ceil(slidesCount / 2))
  }

  const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  //console.log("numberOfSlides", numberOfSlides)

  for (let i = 0; i < numberOfSlides; i++) {
    const liDots = createNewElement(TAGS.LI)

    appendToParent(containerDots, liDots)

    addClass([liDots], CLASS_VALUES.SLIDER_DOT)

    if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
  }
}

/*export function createDots($root: string, containerDots: HTMLElement): void {
  const state = new State($root)

  const isInfinite = state.get(State_Keys.Infinite)
  const slidesPerPage = state.get(State_Keys.SlidesPerPage)
  const $children = getChildren($root)
  const slidesCount = getChildrenCount($children)

  if (isInfinite) {
    // Adiciona uma cópia do primeiro slide no final e uma cópia do último slide no início

    state.set(
      State_Keys.NumberOfSlides,
      slidesPerPage > 1 ? Math.ceil((slidesCount - 2) / slidesPerPage) + 2 : slidesCount + 2
    )
  } else if (slidesPerPage > 1) {
    state.set(State_Keys.NumberOfSlides, Math.ceil(slidesCount / slidesPerPage))
  } else {
    state.set(State_Keys.NumberOfSlides, slidesCount)
  }

  const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  for (let i = 0; i < numberOfSlides; i++) {
    const liDots = createNewElement(TAGS.LI)

    appendToParent(containerDots, liDots)

    addClass([liDots], CLASS_VALUES.SLIDER_DOT)

    if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
  }
}*/
