import { State, State_Keys } from "../../state/BrickState"
import { transform } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"

export class TouchMove {
  state: State
  rootSelector: string
  animation: RequestAnimationFrame

  constructor(rootSelector: string) {
    this.animation = new RequestAnimationFrame(rootSelector)
    this.state = new State(rootSelector)
    this.rootSelector = rootSelector
  }

  public init = (event: Event): void => {
    const { state, rootSelector, animation } = this

    const [isDragging, currentPosition, prevTranslate, startPos] = [
      state.get(State_Keys.isDragging),
      getPositionX(event),
      state.get(State_Keys.prevTranslate),
      state.get(State_Keys.startPos)
    ]

    isDragging &&
      state.set(
        State_Keys.currentTranslate,
        prevTranslate + currentPosition - startPos
      )

    const setCurrentTranslate = state.get(State_Keys.currentTranslate)

    transform(rootSelector, setCurrentTranslate)

    requestAnimationFrame(animation.init)
  }
}
