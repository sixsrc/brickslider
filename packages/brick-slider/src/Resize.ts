import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { ANIMATION_OPTIONS } from "./constants"
import {
  animateElement,
  calcTranslate,
  getSliderWidth,
  translate3d
} from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

export class Resize extends BaseSlider {
  constructor($root: string) {
    super($root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  init(): void {
    this.setState(this.resizeState())
    this.animate()
  }

  private setState(state: Partial<StateType>) {
    this.state.set(state)
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

  private animate(): void {
    const { $children } = this

    animateElement($children, this.keyFrames(), this.options())
  }

  private calcTranslate() {
    const { spacing, slideIndex } = this.store
    const { $children } = this

    return calcTranslate($children, spacing, slideIndex)
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      {
        transform: translate3d(currentTranslate)
      }
    ]
  }

  private options(time = 400): AnimationOptions {
    return {
      duration: time,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }
}
