import { CLASS_VALUES, EVENTS, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { calcSlideWidth, cancelWait, listener, waitFor } from "@/util"
import { checkSlide } from "./checkSlide"
import { setActiveClass } from "./setActiveClass"
import { slideIndexBypass } from "@/core/functions/slideIndexBypass"

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
  const state = new State(rootSelector)

  const from = params.from!

  const $children = getChildren(rootSelector)

  const slides = slideNodeList(rootSelector)

  const currentSlideIndex = state.get(State_Keys.SlideIndex)

  let slideIndex = setSlideIndex({
    from,
    currentSlideIndex,
    index
  })

  const isInfinite = state.get(State_Keys.Infinite)

  const slidesCount = state.get(State_Keys.NumberOfSlides)

  //if (slideIndex <= 0) return

  if (slideIndex > slidesCount + 1) slideIndex = slideIndex - 1

  if ((!isInfinite && slideIndex > slidesCount - 1) || (!isInfinite && slideIndex < 0)) return

  //console.log(slideIndex)

  /*slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })*/

  const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  const slideSpacing = state.get(State_Keys.SlideSpacing)

  const sliderWidth = state.get(State_Keys.SliderWidth)

  //if (!isStopSlider) {
  addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

  const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  //setActiveClass(slides, slideIndex, slidesPerPage, numberOfSlides)

  //console.log(calcSlideWidth(slidesPerPage, slideSpacing, sliderWidth))

  state.set(State_Keys.SlideIndex, slideIndex)

  const animation = new RequestAnimationFrame(rootSelector)

  // state.set(State_Keys.SliderReady, false)

  transformSlider(rootSelector)

  requestAnimationFrame(animation.init)

  const checkSlideCallback = () => checkSlide(rootSelector, isInfinite)

  // const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  if (slidesPerPage <= 1) listener(EVENTS.TRANSITIONSTART, $children, checkSlideCallback)
  //}

  /* const wait = waitFor(100, () => {
    //state.set(State_Keys.isStopSlider, false)
    cancelWait(wait)
  })*/

  // if (isInfinite && slideIndex >= numberOfSlides - 1) state.set(State_Keys.isStopSlider, true)
}
