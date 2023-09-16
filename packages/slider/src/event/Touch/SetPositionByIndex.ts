import { slideIndexBypass } from "@/action/slideIndexBypass"
import { FROM, setCurrentSlide /** */ } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { getRootSelector } from "../../core/functions/getRootSelector"
import { getSliderWidth } from "../../dom/methods/getSliderWidth"
import { State, State_Keys } from "../../state/BrickState"
import { matchStateOptions } from "../../util/matchStateOptions"

export class SetPositionByIndex {
  state: State
  rootSelector: string
  slider: HTMLElement

  constructor(rootSelector: string) {
    this.state = new State(rootSelector)
    this.rootSelector = rootSelector
    this.slider = getRootSelector(this.rootSelector)
  }

  init(): void {
    const { state, rootSelector, slider } = this

    const [sliderWidth, currentIndex] = [
      getSliderWidth(slider),
      state.get(State_Keys.SlideIndex)
    ]

    const currentTranslate = currentIndex * -sliderWidth

    state.setMultipleState({
      [State_Keys.currentTranslate]: currentTranslate,
      [State_Keys.prevTranslate]: currentTranslate
    })

    const [index, from] = [currentIndex, FROM.TOUCH]

    setCurrentSlide({
      from,
      index,
      rootSelector
    })

    const isInfinite = state.get(State_Keys.Infinite)
    const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2
    const slideIndex = isInfinite
      ? slideIndexBypass(index, numberOfSlides)
      : index

    const setActiveDot = () => {
      updateDots(slideIndex, rootSelector)
    }

    matchStateOptions(rootSelector, { [State_Keys.Dots]: true }, setActiveDot)
  }
}
