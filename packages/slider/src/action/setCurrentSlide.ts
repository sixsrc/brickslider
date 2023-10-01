import { CLASS_VALUES, EVENTS, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
import { listener } from "@/util"
import { matchStateOptions } from "@/util/matchStateOptions"
import { checkFirstSlide } from "./checkFirstSlide"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"

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
  const { from, index, rootSelector } = params

  const state = new State(rootSelector)

  const slides = slideNodeList(rootSelector)

  slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })

  const isStopSlider = state.get(State_Keys.isStopSlider)

  if (from && !isStopSlider) {
    const currentSlideIndex = state.get(State_Keys.SlideIndex)

    const slideIndex = setSlideIndex({
      from,
      currentSlideIndex,
      index
    })

    addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, slideIndex)

    //const animation = new RequestAnimationFrame(rootSelector)

    transformSlider(rootSelector)

    //requestAnimationFrame(animation.init)

    const $children = getChildren(rootSelector)

    const isFirstSlide = () => {
      checkFirstSlide(rootSelector, $children)
    }

    listener(EVENTS.TRANSITIONEND, $children, () => {
      matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, isFirstSlide)
    })

    return
  }

  state.setMultipleState({
    [State_Keys.SliderReady]: true,
    [State_Keys.isStopSlider]: false
  })
}
