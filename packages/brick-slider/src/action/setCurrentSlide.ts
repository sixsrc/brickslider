import { transform as transformSlider } from "../transition/transform"
import { setSlideIndex } from "./setIndex"
import { State, State_Keys } from "../state/BrickState"
import { setActiveSlide } from "./setActiveSlide"
import { slideNodeList } from "@/util"

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
    $root: string
  } = {
    $root: ""
  }
): void {
  const { index, $root } = params

  const state = new State($root),
    from = params.from!

  const isInfinite = state.get(State_Keys.Infinite)

  const {
    slideIndex: currentSlideIndex,
    numberOfSlides,
    slidesPerPage
  } = state.store

  const slides = slideNodeList($root)

  let slideIndex = setSlideIndex({
    from,
    currentSlideIndex,
    index
  })

  if (
    (!isInfinite && slideIndex > numberOfSlides - 1) ||
    (!isInfinite && slideIndex < 0)
  )
    return

  if (slideIndex > numberOfSlides + 1) slideIndex = slideIndex - 1

  if (slideIndex < 0) slideIndex = slideIndex + 1

  state.set(State_Keys.SlideIndex, slideIndex)

  setActiveSlide(slides, slideIndex, slidesPerPage)

  transformSlider($root)

  //const isClonedSlide = slideIndex === numberOfSlides - 1 || slideIndex <= 0

  if (isInfinite && slidesPerPage <= 1) {
  }
  /* if (isClonedSlide) {
    }*/
}
