import { getChildren } from "@/core/functions/getChildren"
import { State, State_Keys } from "../../state/BrickState"
import { transform as transformSlider } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { EVENTS, STYLES, TRANSITIONS, eventX } from "@/util/constants"
import { listener, waitFor } from "@/util"
import { setStyle } from "@/dom/methods/setStyle"
import { getSliderWidth } from "@/dom/methods/getSliderWidth"

export class TouchMove {
  $root: string
  state: State
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.animation = new RequestAnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { state, $root, animation } = this

    const setEvent = eventX(event as MouseEvent | TouchEvent)

    const isDragging = state.get(State_Keys.isDragging)

    const currentPosition = getPositionX(setEvent)

    const prevTranslate = state.get(State_Keys.prevTranslate)

    const startPos = state.get(State_Keys.startPos)

    const isInfinite = state.get(State_Keys.Infinite)

    if (isDragging) {
      state.setMultipleState({
        [State_Keys.isTouch]: true,
        [State_Keys.currentTranslate]:
          prevTranslate + currentPosition - startPos
      })

      const direction = currentPosition - startPos > 0 ? "right" : "left"
      //console.log("Direction:", direction)

      const $children = getChildren($root)

      let setCurrentTranslate = state.get(State_Keys.currentTranslate)

      const sliderWidth = getSliderWidth($children)

      listener(
        [EVENTS.TOUCHEND, EVENTS.MOUSEUP, EVENTS.MOUSELEAVE],
        $children,
        () => {
          if (isInfinite && Math.abs(setCurrentTranslate) <= sliderWidth / 2) {
            // console.log("setCurrentTranslate", setCurrentTranslate)
            state.set(State_Keys.IsJumpSlide, true)
            const setTranslate = Math.abs(setCurrentTranslate) + 2352
            state.set(State_Keys.SlideIndex, 4)
            state.set(State_Keys.currentTranslate, -setTranslate)
            const newTranslate = state.get(State_Keys.currentTranslate)
            setCurrentTranslate = newTranslate

            setStyle($children, STYLES.TRANSITION, "")

            transformSlider($root, -newTranslate)

            waitFor(0, () => {
              state.set(State_Keys.currentTranslate, -2352)
              state.set(State_Keys.prevTranslate, -2352)
              setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
              transformSlider($root, -2352)
            })
          }
        }
      )

      transformSlider($root, setCurrentTranslate)

      requestAnimationFrame(animation.init)
    }
  }
}
