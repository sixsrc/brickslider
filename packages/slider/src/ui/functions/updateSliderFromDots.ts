import { getChildren } from "@/core/functions/getChildren"
import { FROM, setCurrentSlide } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { State, State_Keys } from "../../state/BrickState"
import { setStyle } from "@/dom/methods/setStyle"
import { STYLES, TRANSITIONS } from "@/util/constants"

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
    rootSelector: $root
  })
}
