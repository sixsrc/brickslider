import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { ANIMATION_OPTIONS } from "./constants"
import { calcTranslate, getSliderWidth, translate3d } from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

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

  private calcTranslate() {
    const { spacing, slideIndex } = this.store
    const { $children } = this

    return calcTranslate($children, spacing, slideIndex)
  }

  /*private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      {
        transform: translate3d(currentTranslate)
      }
    ]
  }*/
}
