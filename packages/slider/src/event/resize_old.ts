import { getSliderWidth } from "../dom/methods/getSliderWidth"
import { transform as setTransformSlider } from "../transition/transform"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"

export function resize($root: string): void {
  const sliderWidth = getSliderWidth(getChildren($root))
  const state = new State($root)

  state.set(State_Keys.SliderWidth, sliderWidth)

  setTransformSlider($root)
}
