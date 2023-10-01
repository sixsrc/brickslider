import { State, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"

export function setFirstSlideBypass($root: string) {
  const state = new State($root)
  state.set(State_Keys.SlideIndex, 1)
  transformSlider($root)
}
