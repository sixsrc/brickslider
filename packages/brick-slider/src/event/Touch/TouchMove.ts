import { getChildren } from "@/dom"
import { State, State_Keys } from "../../state/BrickState"
import { transform as transformSlider } from "../../transition/transform"
import { AnimationFrame } from "./AnimationFrame"
import { eventX, listener, getPositionX } from "@/util"
import { shouldJumpingSlide } from "@/action"
import { EVENTS } from "@/util/constants"

export class TouchMove {
  $root: string
  state: State
  animation: AnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { state, $root, animation } = this
    const { isDragging, prevTranslate, startPos } = state.store
    const setEvent = eventX(event as MouseEvent | TouchEvent)
    const currentPosition = getPositionX(setEvent)
    const $children = getChildren($root)
    const eventsArray = [EVENTS.TOUCHEND, EVENTS.MOUSEUP, EVENTS.MOUSELEAVE]

    if (isDragging) {
      listener(eventsArray, $children, () => shouldJumpingSlide($root, state))

      state.setMultipleState({
        isTouch: true,
        currentTranslate: prevTranslate + currentPosition - startPos
      })

      let currentTranslate = state.store["currentTranslate"]

      transformSlider($root, currentTranslate)

      requestAnimationFrame(animation.init)
    }
  }
}
//const direction = currentPosition - startPos > 0 ? "right" : "left"
//console.log("Direction:", direction)
