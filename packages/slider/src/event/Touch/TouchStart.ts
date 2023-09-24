import { EVENTS, eventX, slideNodeList, STYLES, TRANSITIONS } from "@/util/constants"
//import { getRootSelector } from "../../core/functions/getRootSelector"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"
import { captureInitialTime, listener } from "@/util"
import { matchStateOptions } from "@/util/matchStateOptions"
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
      const { state, animation } = this
      const setEvent = eventX(event as MouseEvent | TouchEvent)
      const $children = getChildren(this.$root)

      state.set(State_Keys.TouchStartTime, Date.now())

      // state.set(State_Keys.SliderReady, true)

      if (state.get(State_Keys.currentTranslate) < 0)
        setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
      else {
        setStyle($children, STYLES.TRANSITION, "")
      }

      //const $children = getChildren($root)

      listener(EVENTS.TRANSITIONEND, $children, () => {})

      state.setMultipleState({
        [State_Keys.SlideIndex]: index,
        [State_Keys.startPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.animationID]: requestAnimationFrame(animation.init)
      })

      matchStateOptions(this.$root, { [State_Keys.Infinite]: true }, () => {
        checkFirstSlideCloned(this.$root, slideNodeList(this.$root))
        //setStyle($children, STYLES.TRANSITION, "")
      })
    }
  }
}
