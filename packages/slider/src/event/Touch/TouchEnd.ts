import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { slideNodeList, STYLES, TOUCH_LIMIT_SPEED } from "@/util/constants"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"

export class TouchEnd {
  $root: string
  state: State
  setPositionByIndex: SetPositionByIndex
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    this.setPositionByIndex = new SetPositionByIndex($root)
    this.animation = new RequestAnimationFrame($root)
  }
  public init = (): void => {
    const { $root, state, setPositionByIndex, animation } = this

    const isSliderReady = state.get(State_Keys.SliderReady)

    if (isSliderReady) {
      state.set(State_Keys.isDragging, false)

      const touchStartTime = state.get(State_Keys.TouchStartTime)

      const touchEndtTime = state.get(State_Keys.TouchEndTime)

      const diferenceInMs = Math.abs(touchEndtTime - touchStartTime)

      const animationId = state.get(State_Keys.animationID)

      const isMouseLeave = state.get(State_Keys.IsMouseLeave)

      const $children = getChildren($root)

      if (!isMouseLeave) {
        setStyle($children, STYLES.TRANSITION, "")
      }

      if (typeof animationId === "number") {
        requestAnimationFrame(animation.init)
      }
      if (diferenceInMs < TOUCH_LIMIT_SPEED) {
        cancelAnimationFrame(animationId)
      }

      const moveSlider =
        state.get(State_Keys.currentTranslate) - state.get(State_Keys.prevTranslate)

      let currentIndex = state.get(State_Keys.SlideIndex)

      const slides = slideNodeList($root)

      shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
        state.set(State_Keys.SlideIndex, (currentIndex += 1))

      shouldGoToPrevSlide(moveSlider, currentIndex) &&
        state.set(State_Keys.SlideIndex, (currentIndex -= 1))

      setPositionByIndex.init()

      state.setMultipleState({
        [State_Keys.TouchEndTime]: Date.now(),
        [State_Keys.IsMouseLeave]: true
      })
    }
  }
}
