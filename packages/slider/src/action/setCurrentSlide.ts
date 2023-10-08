import { CLASS_VALUES, EVENTS, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { listener } from "@/util"
import { checkSlide } from "./checkSlide"

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
  const { index, rootSelector } = params

  const from = params.from!

  const state = new State(rootSelector)

  const $children = getChildren(rootSelector)

  const slides = slideNodeList(rootSelector)

  const currentSlideIndex = state.get(State_Keys.SlideIndex)

  const slideIndex = setSlideIndex({
    from,
    currentSlideIndex,
    index
  })

  slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })

  const isStopSlider = state.get(State_Keys.isStopSlider)

  if (!isStopSlider) {
    addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, slideIndex)

    const animation = new RequestAnimationFrame(rootSelector)

    transformSlider(rootSelector)

    requestAnimationFrame(animation.init)

    const isInfinite = state.get(State_Keys.Infinite)

    const checkSlideCallback = () => checkSlide(rootSelector, isInfinite)

    listener(EVENTS.TRANSITIONSTART, $children, checkSlideCallback)
  }

  state.set(State_Keys.isStopSlider, false)
}
