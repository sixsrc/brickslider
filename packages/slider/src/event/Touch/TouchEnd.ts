import { childrenSelector, EVENTS } from "@/util/constants"
import { getAllElements } from "../../dom/methods/getAllElements"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { getChildren } from "@/core/functions/getChildren"
import { listener } from "@/util"
import { updateSliderTransition } from "@/action/updateSliderTransition"
import { setSliderTransition } from "@/action/setSliderTransition"
import { getPositionX } from "./functions/getPositionX"
import { matchStateOptions } from "@/util/matchStateOptions"
import { firstSlideCallback } from "./functions/firstSlideCallback"

export class TouchEnd {
  state: State
  slides: HTMLElement[]
  slider: HTMLElement
  rootSelector: string
  setPositionByIndex: SetPositionByIndex

  constructor(rootSelector: string) {
    this.state = new State(rootSelector)
    this.slider = getChildren(rootSelector)
    this.slides = Array.from(getAllElements<HTMLElement>(`${childrenSelector} > *`, this.slider))
    this.setPositionByIndex = new SetPositionByIndex(rootSelector)
    this.rootSelector = rootSelector
  }
  public init = (): void => {
    const { rootSelector, slider: childrenSelector, state, slides, setPositionByIndex } = this

    setSliderTransition(rootSelector)

    state.set(State_Keys.isDragging, false)

    const animationId = state.get(State_Keys.animationID)

    if (typeof animationId === "number") {
      cancelAnimationFrame(animationId)
      updateSliderTransition(rootSelector, "transform 0.2s")
    } else {
      updateSliderTransition(rootSelector, "")
    }

    const moveSlider = state.get(State_Keys.currentTranslate) - state.get(State_Keys.prevTranslate)

    let currentIndex = state.get(State_Keys.SlideIndex)

    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    setPositionByIndex.init()

    const [currentPosition, startPos] = [getPositionX(event), state.get(State_Keys.startPos)]
    const deltaX = currentPosition - startPos

    if (deltaX > 0)
      listener(EVENTS.TRANSITIONEND, childrenSelector, () =>
        matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, () =>
          firstSlideCallback(rootSelector, slides)
        )
      )

    state.set(State_Keys.SliderReady, true)
  }
}
