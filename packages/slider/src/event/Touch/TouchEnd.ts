import { childrenSelector /*TAGS*/ } from "@/util/constants"
//import { getRootSelector } from "../../core/functions/getRootSelector"
import { getAllElements } from "../../dom/methods/getAllElements"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { getChildren } from "@/core/functions/getChildren"

export class TouchEnd {
  state: State
  slides: HTMLElement[]
  slider: HTMLElement
  rootSelector: string
  setPositionByIndex: SetPositionByIndex

  constructor(rootSelector: string) {
    this.state = new State(rootSelector)
    this.slider = getChildren(rootSelector)
    this.slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, this.slider)
    )
    this.setPositionByIndex = new SetPositionByIndex(rootSelector)
    this.rootSelector = rootSelector
  }
  public init = (): void => {
    const { state, slides, slider, setPositionByIndex } = this

    state.set(State_Keys.isDragging, false)

    slider.oncontextmenu = null

    const animationId = state.get(State_Keys.animationID)
    if (typeof animationId === "number") {
      cancelAnimationFrame(animationId)
    }

    const moveSlider =
      state.get(State_Keys.currentTranslate) -
      state.get(State_Keys.prevTranslate)

    let currentIndex = state.get(State_Keys.SlideIndex)

    if (shouldGoToNextSlide(moveSlider, currentIndex, slides))
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    if (shouldGoToPrevSlide(moveSlider, currentIndex))
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    setPositionByIndex.init()
  }
}
