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

type ResizeStateSlider = Pick<StateType, "sliderWidth">

export class Resize extends BaseSlider {
  constructor($root: string) {
    super($root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  init(): void {
    this.setState(this.resizeState())
    this.animate()
  }

  private setState(state: any) {
    this.state.set(state)
  }

  private resizeState(): Partial<ResizeStateSlider> {
    return { sliderWidth: this.sliderWidth }
  }

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private keyFrames(): KeyframeAnimation[] {
    const { spacing, slideIndex } = this.store
    const translate = calcTranslate(this.$children, spacing, slideIndex)

    return [
      {
        transform: translate3d(translate)
      }
    ]
  }

  private options(): AnimationOptions {
    return {
      duration: 0,
      easing: ANIMATION_OPTIONS.EASEOUT
    }
  }
}
