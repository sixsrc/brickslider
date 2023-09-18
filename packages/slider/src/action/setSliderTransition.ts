import { getChildren } from "@/core/functions/getChildren"
import { getAllElements } from "@/dom/methods/getAllElements"
import { State, State_Keys } from "@/state/BrickState"
import { listener } from "@/util"
import { CLASS_VALUES, EVENTS, childrenSelector } from "@/util/constants"
import { matchStateOptions } from "@/util/matchStateOptions"
import { transform } from "@/transition/transform"
import { hasClass } from "@/dom/methods/hasClass"
import { updateSliderTransition } from "./updateSliderTransition"
import { removeClass } from "@/dom/methods/removeClass"
import { setStyle } from "@/dom/methods/setStyle"
import { FROM } from "./setCurrentSlide"

export function setSliderTransition(rootSelector: string) {
  const slider = getChildren(rootSelector),
    slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, getChildren(rootSelector))
    ),
    state = new State(rootSelector)

  listener(EVENTS.TRANSITIONEND, slider, () => {
    //updateSliderTransition(rootSelector, "none")
    //updateSliderTransition(rootSelector, "transform 400ms  ease-in-out")
  })
  ///cubic-bezier(0.25, 1, 0.5,1)

  matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, () => {
    slides.forEach((slide, index) => {
      const numberOfSlides = state.get(State_Keys.NumberOfSlides)

      listener(EVENTS.TRANSITIONEND, slider, () => {
        if (hasClass(slide, CLASS_VALUES.ACTIVE) && index === 0) {
          state.set(State_Keys.SlideIndex, numberOfSlides)
          transform(rootSelector)
          removeClass(slide, CLASS_VALUES.ACTIVE)
          updateSliderTransition(rootSelector, "none")
        }
      })
    })
  })
}

/*
          removeClass(slide, CLASS_VALUES.ACTIVE)
             updateSliderTransition(rootSelector, "none")
             state.set(State_Keys.SlideIndex, numberOfSlides)
             transform(rootSelector)
          */

//updateSliderTransition(rootSelector, "none")
//removeClass(slide, CLASS_VALUES.ACTIVE)
