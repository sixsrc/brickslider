import { State, StateType } from "@/state/BrickState"
import { transform } from "@/transition/transform"

export class AnimationFrame {
  public $root: string
  private store: StateType

  constructor($root: string) {
    this.$root = $root
    this.store = State.store(this.$root)
  }
  public init = (): void => {
    const { currentTranslate, isDragging } = this.store

    transform(this.$root, currentTranslate)

    if (isDragging) requestAnimationFrame(this.init)
  }
}
