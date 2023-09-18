import { getRootSelector } from "../../core/functions/getRootSelector"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"

export class TouchStart {
  state: State
  rootSelector: string
  animation: RequestAnimationFrame
  slider: HTMLElement

  constructor(rootSelector: string) {
    this.state = new State(rootSelector)
    this.animation = new RequestAnimationFrame(rootSelector)
    this.rootSelector = rootSelector
    this.slider = getRootSelector(this.rootSelector)
  }

  public init(index: number): (event: Event) => void {
    return (event: Event) => {
      const { state, animation, slider } = this

      slider.oncontextmenu = event => {
        event.preventDefault()
        event.stopPropagation()
        return false
      }

      setTimeout(() => {
        state.setMultipleState({
          [State_Keys.SlideIndex]: index,
          [State_Keys.startPos]: getPositionX(event),
          [State_Keys.isDragging]: true,
          [State_Keys.animationID]: requestAnimationFrame(animation.init)
        })
      })
    }
  }
}
