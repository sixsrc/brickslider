import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { slideNodeList, STYLES, TOUCH_LIMIT, TRANSITIONS } from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"

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

    const $children = getChildren($root)

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    state.set(State_Keys.isDragging, false)

    const touchStartTime = state.get(State_Keys.TouchStartTime)
    const touchEndtTime = state.get(State_Keys.TouchEndTime)
    const diferenceInMs = Math.abs(touchEndtTime - touchStartTime)

    const animationId = state.get(State_Keys.animationID)

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    if (diferenceInMs < TOUCH_LIMIT) requestAnimationFrame(animation.init)

    const moveSlider = state.get(State_Keys.currentTranslate) - state.get(State_Keys.prevTranslate)

    let currentIndex = state.get(State_Keys.SlideIndex)

    const slides = slideNodeList($root)

    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    setPositionByIndex.init()

    state.set(State_Keys.TouchEndTime, Date.now())
  }
}
