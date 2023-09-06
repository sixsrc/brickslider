import { CLASS_VALUES, /*TAGS,*/ childrenSelector } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { hasClass } from "../dom/methods/hasClass"
import { removeClass } from "../dom/methods/removeClass"
import { getAllElements } from "../dom/methods/getAllElements"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { matchStateOptions } from "../util/matchStateOptions"

export enum FROM {
  DOTS = "dots",
  PREV = "prev",
  NEXT = "next",
  TOUCH = "touch"
}

export function setCurrentSlide(
  params: {
    from?: FROM.DOTS | FROM.PREV | FROM.NEXT | FROM.TOUCH
    index?: number
    rootSelector: string
  } = {
    rootSelector: ""
  }
): void {
  const { from, index, rootSelector } = params,
    state = new State(rootSelector),
    slider = getChildren(rootSelector),
    slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, slider)
    )

  const isInfinite = matchStateOptions(rootSelector, {
    [State_Keys.Infinite]: true
  })

  slides.forEach((slide, index) => {
    const [isFirstSlide, isLastSlide] = [
      !isInfinite && from === FROM.PREV && index === 0,
      !isInfinite && from === FROM.NEXT && index === slides.length - 1
    ]

    switch (true) {
      case hasClass(slide, CLASS_VALUES.ACTIVE) &&
        (isFirstSlide || isLastSlide):
        state.set(State_Keys.isStopSlider, true)
        break

      case hasClass(slide, CLASS_VALUES.ACTIVE) &&
        !state.get(State_Keys.isStopSlider):
        removeClass(slide, CLASS_VALUES.ACTIVE)
        state.set(State_Keys.SlideIndex, index)
        break

      default:
        break
    }
  })

  if (!state.get(State_Keys.isStopSlider) && from) {
    const currentSlideIndex = state.get(State_Keys.SlideIndex),
      slideIndex = setSlideIndex({
        from,
        currentSlideIndex,
        index
      }),
      getSlidePosition = (slideIndex + slides.length) % slides.length

    addClass([slides[getSlidePosition]], CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, getSlidePosition)

    transformSlider(rootSelector)
  } else {
    state.setMultipleState({
      [State_Keys.SliderReady]: true,
      [State_Keys.isStopSlider]: false
    })
  }
}
