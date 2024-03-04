import { getChildren, getSliderWidth, setStyle } from "@/dom"
import { State, State_Keys } from "../../state/BrickState"
import { transform as transformSlider } from "../../transition/transform"
import { AnimationFrame } from "./AnimationFrame"
import { eventX, listener, waitFor, getPositionX } from "@/util"
import { EVENTS, STYLES, TRANSITIONS } from "@/util/constants"
import { updateDots } from "@/action"

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

    const setEvent = eventX(event as MouseEvent | TouchEvent)

    const {
      isDragging,
      prevTranslate,
      startPos,
      infinite: isInfinite
    } = state.store

    const currentPosition = getPositionX(setEvent)

    const $children = getChildren($root)

    const sliderWidth = getSliderWidth($children)

    if (isDragging) {
      state.setMultipleState({
        [State_Keys.isTouch]: true,
        [State_Keys.currentTranslate]:
          prevTranslate + currentPosition - startPos
      })

      //const direction = currentPosition - startPos > 0 ? "right" : "left"
      //console.log("Direction:", direction)

      let setCurrentTranslate = state.get(State_Keys.currentTranslate)

      listener(
        [EVENTS.TOUCHEND, EVENTS.MOUSEUP, EVENTS.MOUSELEAVE],
        $children,
        () => {
          if (isInfinite && Math.abs(setCurrentTranslate) <= sliderWidth / 2) {
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
