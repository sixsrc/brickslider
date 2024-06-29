import { State, StateType } from "./State"
import {
  getChildren,
  getChildrenCount,
  getSliderWidth,
  getTrackChildren
} from "./helpers"

export class BaseSlider {
  protected $root: string
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected $track: HTMLElement | any
  protected childrenCount: number
  protected sliderWidth: number | undefined

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.$track = getTrackChildren($root)
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  /* protected setState(_event?: Event, _state?: Partial<StateType> | any) {
    this.state.set(_state)
  }*/
  protected updateDOM(_event?: Event) {}
  protected handleEvents(_event?: Event) {}
}
