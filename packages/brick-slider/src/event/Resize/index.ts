import { getChildren, getSliderWidth } from "@/dom"
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

    const state = new State($root),
      { slideSpacing, slideIndex } = state.store

    const sliderWidth = getSliderWidth(getChildren($root))

    const $children = getChildren($root)

    const translate = calcTranslate($children, slideSpacing, slideIndex)

    state.set(State_Keys.SliderWidth, sliderWidth)

    transformSlider($root, translate)
  }
}
