import { FROM, setCurrentSlide } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { State, State_Keys } from "../../state/BrickState"

export function updateSliderFromDots($root: string): void {
  const state = new State($root)
  const from = FROM.DOTS

  let index = state.get(State_Keys.SlideIndex)

  updateDots(index, $root)

  const isInfinite = state.get(State_Keys.Infinite)

  setCurrentSlide({
    from,
    index: isInfinite ? ++index : index,
    rootSelector: $root
  })
}
