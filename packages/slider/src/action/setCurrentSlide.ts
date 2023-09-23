import { CLASS_VALUES, childrenSelector } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { getAllElements } from "../dom/methods/getAllElements"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
<<<<<<< HEAD
import { setSliderTransition } from "./setSliderTransition"
import { updateSliderTransition } from "./updateSliderTransition"
//import { updateSliderTransition } from "./updateSliderTransition"
=======
>>>>>>> master

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
    slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, getChildren(rootSelector))
    )

  slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })

  if (from && !state.get(State_Keys.isStopSlider)) {
    const currentSlideIndex = state.get(State_Keys.SlideIndex),
      slideIndex = setSlideIndex({
        from,
        currentSlideIndex,
        index
      })

    addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, slideIndex)

<<<<<<< HEAD
    /* if (from == FROM.PREV || from === FROM.NEXT) {
      setSliderTransition(rootSelector)
      updateSliderTransition(rootSelector, "transform 400ms  cubic-bezier(0.25, 1, 0.5,1)")
    }*/

    transformSlider(rootSelector)

    //FROM.PREV &&
    // FROM.NEXT &&
    // updateSliderTransition(rootSelector, "transform 400ms  cubic-bezier(0.25, 1, 0.5,1)")
    // transformSlider(rootSelector)

=======
    transformSlider(rootSelector)

>>>>>>> master
    return
  }

  state.setMultipleState({
    [State_Keys.SliderReady]: true,
    [State_Keys.isStopSlider]: false
  })
}
