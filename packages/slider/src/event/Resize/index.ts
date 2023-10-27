import { getChildren } from "@/core/functions/getChildren"
import { getSliderWidth } from "@/dom/methods/getSliderWidth"
import { State, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { calcTranslate } from "@/util"

export class Resize {
  $root: string

  constructor($root: string) {
    this.$root = $root
  }

  init(): void {
    const { $root } = this

    const state = new State($root)

    const sliderWidth = getSliderWidth(getChildren($root))

    const $children = getChildren($root)

    const slideSpacing = state.get(State_Keys.SlideSpacing)

    const index = state.get(State_Keys.SlideIndex)

    state.set(State_Keys.SliderWidth, sliderWidth)

    const translate = calcTranslate($children, slideSpacing, index)

    transformSlider($root, translate)
  }
}
