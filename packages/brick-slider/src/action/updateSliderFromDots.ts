import { FROM, setCurrentSlide } from "./setCurrentSlide"
import { State, State_Keys } from "../state/BrickState"
import { STYLES, TRANSITIONS } from "@/util/constants"
import { updateDots } from "./updateDots"
import { getChildren, setStyle } from "@/dom"

export function updateSliderFromDots($root: string): void {
  const state = new State($root)

  const from = FROM.DOTS

  let index = state.get(State_Keys.SlideIndex)

  updateDots(index, $root)

  const isInfinite = state.get(State_Keys.Infinite)

  const $children = getChildren($root)

  setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

  setCurrentSlide({
    from,
    index: isInfinite ? ++index : index,
    $root
  })
}
