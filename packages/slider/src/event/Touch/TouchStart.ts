import { eventX } from "@/util/constants"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"

export class TouchStart {
  $root: string
  state: State
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    this.animation = new RequestAnimationFrame($root)
  }

  public init(index: number): (event: Event) => void {
    return (event: Event) => {
      const { state, animation } = this

      const setEvent = eventX(event as MouseEvent | TouchEvent)

      if (!state.get(State_Keys.SliderReady)) return

      //if (state.get(State_Keys.SliderReady))

      state.set(State_Keys.TouchStartTime, Date.now())

      state.setMultipleState({
        [State_Keys.SliderReady]: true,
        [State_Keys.SlideIndex]: index,
        [State_Keys.startPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.IsMouseLeave]: false,
        [State_Keys.animationID]: requestAnimationFrame(animation.init)
      })
    }
  }
}
