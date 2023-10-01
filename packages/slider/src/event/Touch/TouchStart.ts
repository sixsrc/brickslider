import { eventX, slideNodeList, STYLES } from "@/util/constants"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"
import { checkFirstSlideCloned } from "./functions/checkFirstSlideCloned"

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
      const { $root, state, animation } = this
      const setEvent = eventX(event as MouseEvent | TouchEvent)
      const $children = getChildren(this.$root)

      setStyle($children, STYLES.TRANSITION, "")

      state.set(State_Keys.TouchStartTime, Date.now())

      state.setMultipleState({
        [State_Keys.SliderReady]: true,
        [State_Keys.SlideIndex]: index,
        [State_Keys.startPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.IsMouseLeave]: false,
        [State_Keys.animationID]: requestAnimationFrame(animation.init)
      })

      const isInFinite = state.get(State_Keys.Infinite)

      if (isInFinite) checkFirstSlideCloned($root, slideNodeList($root))
    }
  }
}
