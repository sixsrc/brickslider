import { getChildren } from "@/dom"
import { State, State_Keys } from "../../state/BrickState"
import { transform as transformSlider } from "../../transition/transform"
import { AnimationFrame } from "./AnimationFrame"
import { eventX, listener, getPositionX } from "@/util"
import { EVENTS } from "@/util/constants"
import { shouldSkipSlide } from "@/action/shouldSkipSlide"

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
    const { isDragging, prevTranslate, startPos } = this.state.store
    const currentPosition = getPositionX(
      eventX(event as MouseEvent | TouchEvent)
    )
    const $children = getChildren(this.$root)
    const eventsArray = [EVENTS.TOUCHEND, EVENTS.MOUSEUP, EVENTS.MOUSELEAVE]

    if (isDragging) {
      listener(eventsArray, $children, () =>
        shouldSkipSlide(this.$root, this.state)
      )

      this.state.setMultipleState({
        isTouch: true,
        currentTranslate: prevTranslate + currentPosition - startPos
      })

      const currentTranslate = this.state.store[State_Keys.currentTranslate]

      transformSlider(this.$root, currentTranslate)

      requestAnimationFrame(this.animation.init)
    }
  }
}
//const direction = currentPosition - startPos > 0 ? "right" : "left"
//console.log("Direction:", direction)
