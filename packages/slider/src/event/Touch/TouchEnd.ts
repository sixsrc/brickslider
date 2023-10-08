import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { slideNodeList, STYLES, /*TOUCH_LIMIT,*/ TRANSITIONS } from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"

export class TouchEnd {
  $root: string
  state: State
  setPositionByIndex: SetPositionByIndex
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.setPositionByIndex = new SetPositionByIndex(this.$root)
    this.animation = new RequestAnimationFrame(this.$root)
  }

  public init = (): void => {
    const { $root, state, setPositionByIndex } = this

    const $children = getChildren($root)

    state.set(State_Keys.isDragging, false)

    const animationId = state.get(State_Keys.animationID)

    const isMouseLeave = state.get(State_Keys.IsMouseLeave)

    const isInfinite = state.get(State_Keys.Infinite)

    const slideIndex = state.get(State_Keys.SlideIndex)

    const isSliderReady = state.get(State_Keys.SliderReady)

    if (isInfinite && slideIndex <= 0) state.set(State_Keys.SliderReady, false)

    if (!isSliderReady) return

    if (!isMouseLeave) setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    const moveSlider = state.get(State_Keys.currentTranslate) - state.get(State_Keys.prevTranslate)

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
