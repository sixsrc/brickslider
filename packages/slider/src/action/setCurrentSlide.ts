import { CLASS_VALUES, EVENTS, STYLES, childrenSelector, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { getAllElements } from "../dom/methods/getAllElements"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
import { checkFirstSlideCloned } from "@/event/Touch/functions/checkFirstSlideCloned"
import { listener } from "@/util"
import { matchStateOptions } from "@/util/matchStateOptions"
import { setStyle } from "@/dom/methods/setStyle"

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
    const currentSlideIndex = state.get(State_Keys.SlideIndex)
    const slideIndex = setSlideIndex({
      from,
      currentSlideIndex,
      index
    })

    addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, slideIndex)

    transformSlider(rootSelector)

    const $children = getChildren(rootSelector)

    listener(EVENTS.TRANSITIONEND, $children, () => {
      matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, () => {
        checkFirstSlideCloned(rootSelector, slideNodeList(rootSelector))
        setStyle($children, STYLES.TRANSITION, "")
      })
    })

    return
  }

  state.setMultipleState({
    [State_Keys.SliderReady]: true,
    [State_Keys.isStopSlider]: false
  })
}
