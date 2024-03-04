import { State } from "../../state/BrickState"
import { transform } from "../../transition/transform"

export class AnimationFrame {
  $root: string
  state: State

  constructor($root: string) {
    this.state = new State($root)
    this.$root = $root
  }
  public init = (): void => {
    const { state, $root, init } = this

    const { currentTranslate, isDragging } = state.store

    transform($root, currentTranslate)

    isDragging && requestAnimationFrame(init)
  }
}
