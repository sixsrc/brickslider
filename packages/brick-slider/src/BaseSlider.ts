import { MoveTracker } from "./MoveTracker"
import { State, StateType } from "./State"
import { getChildren, getChildrenCount, getTrackChildren } from "./helpers"

export class BaseSlider {
  protected $root: string
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected $track: HTMLElement | any
  protected childrenCount: number
  protected moveTracker: MoveTracker

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) || ""
    this.$track = getTrackChildren($root)
    this.moveTracker = new MoveTracker()
    this.childrenCount = getChildrenCount(this.$children)
  }

  protected setState(_event?: Event) {}
  protected updateDOM(_event?: Event) {}
  protected handleEvents(_event?: Event) {}
}
