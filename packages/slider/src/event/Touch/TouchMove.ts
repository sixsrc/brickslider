import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { transform as transformSlider } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { STYLES, eventX } from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"

export class TouchMove {
  $root: string
  state: State
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    this.animation = new RequestAnimationFrame($root)
  }

  public init = (event: Event): void => {
    const { state, $root, animation } = this

    const setEvent = eventX(event as MouseEvent | TouchEvent)

    const isDragging = state.get(State_Keys.isDragging)

    const currentPosition = getPositionX(setEvent)

    const prevTranslate = state.get(State_Keys.prevTranslate)

    const startPos = state.get(State_Keys.startPos)

    const $children = getChildren($root)

    const isMouseLeave = state.get(State_Keys.IsMouseLeave)

    if (!isMouseLeave) setStyle($children, STYLES.TRANSITION, "")

    if (isDragging) {
      state.setMultipleState({
        [State_Keys.SliderReady]: true,
        [State_Keys.currentTranslate]: prevTranslate + currentPosition - startPos
      })

      const setCurrentTranslate = state.get(State_Keys.currentTranslate)

      transformSlider($root, setCurrentTranslate)

      requestAnimationFrame(animation.init)
    }
  }
}
