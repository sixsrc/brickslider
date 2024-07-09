import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { getSliderWidth } from "./helpers"

export class Resize extends BaseSlider {
  constructor($root: string) {
    super($root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  init(): void {
    this.setState(this.resizeState())
    this.animate(this.keyFrames(), this.options())
  }

  private resizeState(): Partial<StateType> {
    const { sliderWidth } = this
    const translate = this.calcTranslate()

    return {
      sliderWidth,
      prevTranslate: translate,
      currentTranslate: translate
    }
  }
}
