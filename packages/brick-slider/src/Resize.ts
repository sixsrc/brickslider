import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
import { calcTranslate, getSliderWidth, transform } from "./helpers"

export class Resize extends BaseSlider {
  private sliderWidth: number

  constructor($root: string) {
    super($root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  init(): void {
    const { spacing, slideIndex } = this.store
    const translate = calcTranslate(this.$children, spacing, slideIndex)

    this.state.set({ [State_Keys.SliderWidth]: this.sliderWidth })

    transform(this.$root, translate)
  }
}
