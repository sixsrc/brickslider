import { Base } from "@/core/Base"
import { getSliderWidth } from "@/dom/getSliderWidth"
import { State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { calcTranslate } from "@/util/calcTranslate"

export class Resize extends Base {
  private sliderWidth: number

  constructor($root: string) {
    super($root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  init(): void {
    const { spacing, slideIndex } = this.store
    const translate = calcTranslate(this.$children, spacing, slideIndex)

    this.state.set({ [State_Keys.SliderWidth]: this.sliderWidth })

    transformSlider(this.$root, translate)
  }
}
