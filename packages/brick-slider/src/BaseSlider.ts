import { State, StateType } from "./State"
import { getChildren, getChildrenCount } from "./helpers"

export class BaseSlider {
  protected $root: string
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected childrenCount: number

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root)
    this.childrenCount = getChildrenCount(this.$children)
  }

  protected setState(_event?: Event) {}
  protected updateDOM() {}
  protected handleEvents(event?: Event) {}
}
