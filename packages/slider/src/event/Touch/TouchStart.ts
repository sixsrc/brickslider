import { eventX, STYLES } from "@/util/constants"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"

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

      const $children = getChildren(this.$root)

      const isSliderReady = state.get(State_Keys.SliderReady)

      const isInfinite = state.get(State_Keys.Infinite)

      const slideIndex = state.get(State_Keys.SlideIndex)

      if (isInfinite && slideIndex <= 0) state.set(State_Keys.SliderReady, false)

      if (!isSliderReady) return

      state.set(State_Keys.SliderReady, true)

      setStyle($children, STYLES.TRANSITION, "")

      state.setMultipleState({
        [State_Keys.TouchStartTime]: Date.now(),
        [State_Keys.SlideIndex]: index,
        [State_Keys.startPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.IsMouseLeave]: false,
        [State_Keys.animationID]: requestAnimationFrame(animation.init)
      })
    }
  }
}
