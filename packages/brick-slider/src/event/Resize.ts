import { getChildren } from "@/dom/getChildren"
import { getSliderWidth } from "@/dom/getSliderWidth"
import { State, StateType, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { calcTranslate } from "@/util/calcTranslate"

export class Resize {
  public $root: string
  private $children: HTMLElement
  private state: State
  private store: StateType
  private sliderWidth: number

  constructor($root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  init(): void {
    const { spacing, slideIndex } = this.store

    const translate = calcTranslate(this.$children, spacing, slideIndex)

    this.state.seti({ [State_Keys.SliderWidth]: this.sliderWidth })

    transformSlider(this.$root, translate)
  }
}
