import { matchStateOptions } from "@/util/matchStateOptions"
import { addClass } from "../../dom/methods/addClass"
import { appendToParent } from "../../dom/methods/appendToParent"
import { createNewElement } from "../../dom/methods/createNewElement"
import { CLASS_VALUES, TAGS } from "../../util/constants"
import { State, State_Keys } from "@/state/BrickState"

export function createDots(
  rootSelector: string,
  //numberOfSlides: number,
  containerDots: HTMLElement
): void {
  const state = new State(rootSelector)

  matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, () => {
    state.set(
      State_Keys.NumberOfSlides,
      state.get(State_Keys.NumberOfSlides) - 2
    )
  })
  const numberOfSlides = state.get(State_Keys.NumberOfSlides)
  for (let i = 0; i < numberOfSlides; i++) {
    const liDots = createNewElement(TAGS.LI)
    appendToParent(containerDots, liDots)
    addClass([liDots], CLASS_VALUES.SLIDER_DOT)
    if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
  }
}
