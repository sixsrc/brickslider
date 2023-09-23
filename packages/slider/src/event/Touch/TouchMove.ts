import { getChildren } from "@/core/functions/getChildren"
import { State, State_Keys } from "../../state/BrickState"
import { transform } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { updateSliderTransition } from "@/action/updateSliderTransition"

export class TouchMove {
  state: State
  rootSelector: string
  slider: HTMLElement
  animation: RequestAnimationFrame

  constructor(rootSelector: string) {
    this.animation = new RequestAnimationFrame(rootSelector)
    this.state = new State(rootSelector)
    this.rootSelector = rootSelector
    this.slider = getChildren(this.rootSelector)
  }

  public init = (event: Event): void => {
    const { state, rootSelector, animation } = this

    const [isDragging, currentPosition, prevTranslate, startPos] = [
      state.get(State_Keys.isDragging),
      getPositionX(event),
      state.get(State_Keys.prevTranslate),
      state.get(State_Keys.startPos)
    ]

    updateSliderTransition(rootSelector, "")

    if (isDragging && !state.get(State_Keys.SliderReady)) {
      state.set(State_Keys.currentTranslate, prevTranslate + currentPosition - startPos)

      if (state.get(State_Keys.SliderReady)) {
        const setCurrentTranslate = state.get(State_Keys.currentTranslate)
        transform(rootSelector, setCurrentTranslate)
        requestAnimationFrame(animation.init)
      }
    }
  }
}
