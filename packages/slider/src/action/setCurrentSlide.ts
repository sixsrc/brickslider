import { CLASS_VALUES, EVENTS, STYLES, TRANSITIONS, slideNodeList } from "../util/constants"
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
  const { index, rootSelector } = params

  const state = new State(rootSelector)

  const from = params.from!

  const $children = getChildren(rootSelector)

  const slides = slideNodeList(rootSelector)

  const currentSlideIndex = state.get(State_Keys.SlideIndex)

  //setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

  let slideIndex = setSlideIndex({
    from,
    currentSlideIndex,
    index
  })

  const isInfinite = state.get(State_Keys.Infinite)

  const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  if (slideIndex > numberOfSlides + 1) slideIndex = slideIndex - 1

  if (slideIndex < 0) slideIndex = slideIndex + 1

  if ((!isInfinite && slideIndex > numberOfSlides - 1) || (!isInfinite && slideIndex < 0)) return

  /*slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })*/

  const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  // const slideSpacing = state.get(State_Keys.SlideSpacing)

  //const sliderWidth = state.get(State_Keys.SliderWidth)

  //if (!isStopSlider) {
  addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

  //const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  //setActiveClass(slides, slideIndex, slidesPerPage, numberOfSlides)

  //console.log(calcSlideWidth(slidesPerPage, slideSpacing, sliderWidth))

  state.set(State_Keys.SlideIndex, slideIndex)

  //const animation = new RequestAnimationFrame(rootSelector)

  // state.set(State_Keys.SliderReady, false)

  transformSlider(rootSelector)

  // requestAnimationFrame(animation.init)

  const checkSlideCallback = () => checkSlide(rootSelector, isInfinite)

  const isTouch = state.get(State_Keys.isTouch)

  // const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  if (isInfinite && slidesPerPage <= 1)
    if (slideIndex === numberOfSlides - 1 || slideIndex <= 0) {
      listener(EVENTS.TRANSITIONEND, $children, checkSlideCallback)
    }

  //if ((isInfinite && slidesPerPage <= 1 && slideIndex === slidesCount - 1) || slideIndex <= 0)
  // listener(EVENTS.TRANSITIONEND, $children, checkSlideCallback)

  //}
}
