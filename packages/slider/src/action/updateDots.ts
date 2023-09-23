import { CLASS_VALUES, TAGS } from "../util/constants"
import { getAllElements } from "../dom/methods/getAllElements"
import { hasClass } from "../dom/methods/hasClass"
import { removeClass } from "../dom/methods/removeClass"
import { addClass } from "../dom/methods/addClass"
import { State, State_Keys } from "../state/BrickState"
import { getDotsSelector } from "../core/functions/getDotsSelector"
<<<<<<< HEAD
import { convertToOriginalIndex } from "./convertToOriginalIndex"

export function updateDots(index: number, rootSelector: string): void {
  const dots = getAllElements<HTMLElement>(
    TAGS.LI,
    getDotsSelector(rootSelector)
  )
  const state = new State(rootSelector)
  const selectedIndex = index ?? 0
  const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2
=======

export function updateDots(index: number, rootSelector: string): void {
  const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector(rootSelector))
  //const state = new State(rootSelector)
  const selectedIndex = index ?? 0
  //const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2
>>>>>>> master

  dots.forEach((dot, i) => {
    if (hasClass(dot, CLASS_VALUES.SELECTED)) {
      removeClass(dot, CLASS_VALUES.SELECTED)
      //const index = convertToOriginalIndex(selectedIndex, numberOfSlides)
      //state.set(State_Keys.SlideIndex, index)
    }
    if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
  })
}
