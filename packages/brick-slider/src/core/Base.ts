import { getChildren } from "@/dom/getChildren"
import { State, StateType } from "@/state/BrickState"

export class Base {
  protected $root: string
  protected state: State
  protected store: StateType
  protected $children: HTMLElement

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root)
  }

  protected setState(_event?: Event) {}
  protected updateDOM() {}
  protected handleEvents() {}
}
