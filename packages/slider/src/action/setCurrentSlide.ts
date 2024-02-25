import { EVENTS, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
//import { checkSlide } from "./checkSlide"
import { setActiveClass } from "./setActiveClass"
import { listener } from "@/util"
import { checkSlideCloned } from "./checkSlideCloned"

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

  const numberOfSlides = state.get(State_Keys.NumberOfSlides)

  if (
    (!isInfinite && slideIndex > numberOfSlides - 1) ||
    (!isInfinite && slideIndex < 0)
  )
    return

  if (slideIndex > numberOfSlides + 1) slideIndex = slideIndex - 1

  if (slideIndex < 0) slideIndex = slideIndex + 1

  const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  state.set(State_Keys.SlideIndex, slideIndex)

  setActiveClass(slides, slideIndex, slidesPerPage)

  transformSlider(rootSelector)

  //if (!isInfinite) state.set(State_Keys.SliderReady, true)

  const checkSlideCallback = () => checkSlideCloned(rootSelector)

  const isClonedSlide = slideIndex === numberOfSlides - 1 || slideIndex <= 0

  if (isInfinite && slidesPerPage <= 1)
    if (isClonedSlide) {
    }
  // listener(EVENTS.TRANSITIONEND, $children, checkSlideCallback)
}
