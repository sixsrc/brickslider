import { getChildren } from "@/core/functions/getChildren"
import { getSliderWidth } from "@/dom/methods/getSliderWidth"
import { State, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"

export class Resize {
  $root: string

  constructor($root: string) {
    this.$root = $root
  }

  init(): void {
    const { $root } = this
    const sliderWidth = getSliderWidth(getChildren($root))
    const state = new State($root)

    state.set(State_Keys.SliderWidth, sliderWidth)

    transformSlider($root)
  }
}
