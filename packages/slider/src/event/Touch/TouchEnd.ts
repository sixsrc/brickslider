import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { slideNodeList, STYLES, TRANSITIONS } from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"
import { transform } from "@/transition/transform"

export class TouchEnd {
  $root: string
  state: State
  setPositionByIndex: SetPositionByIndex

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    this.setPositionByIndex = new SetPositionByIndex($root)
  }
  public init = (): void => {
    const { $root, state, setPositionByIndex } = this

    const $children = getChildren($root)

    //if (!state.get(State_Keys.SliderReady)) return

    state.set(State_Keys.isDragging, false)

    const touchStartTime = state.get(State_Keys.TouchStartTime)
    const touchEndtTime = state.get(State_Keys.TouchEndTime)
    const diferenceInMs = Math.abs(touchEndtTime - touchStartTime)

    const animationId = state.get(State_Keys.animationID)

    if (typeof animationId === "number") {
      cancelAnimationFrame(animationId)
    }

    if (diferenceInMs < 150) {
      transform($root, state.get(State_Keys.prevTranslate))
      console.log("minhapica!!!")
    }

    const moveSlider = state.get(State_Keys.currentTranslate) - state.get(State_Keys.prevTranslate)

    let currentIndex = state.get(State_Keys.SlideIndex)
    const slides = slideNodeList($root)

    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    setPositionByIndex.init()

    state.set(State_Keys.TouchEndTime, Date.now())
    //console.log(diferenceInMs)
  }
}
