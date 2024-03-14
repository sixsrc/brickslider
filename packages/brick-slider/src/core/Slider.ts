import { State, StateType } from "@/state"
import { arrayToClasses, slideNodeList } from "@/util"
import { setActiveSlide, setSlideIndex } from "@/action"
import { State_Keys } from "@/state/BrickState"
import { Actions } from "./Actions"

export enum FROM {
  DOTS = "dots",
  PREV = "prev",
  NEXT = "next",
  TOUCH = "touch"
}

export type SetCurrentSlideType = {
  from?: FROM.DOTS | FROM.PREV | FROM.NEXT | FROM.TOUCH
  index?: number
  $root: string | ""
}

export class Slider {
  private $root: string

  constructor($root: string) {
    this.$root = $root
  }

  public setCurrentSlide(params: SetCurrentSlideType): void {
    const { index, from } = params
    const instances = arrayToClasses([State, Actions], this.$root)
    const [state, slider] = instances as [State, Actions]
    const {
      slideIndex: currentSlideIndex,
      infinite,
      numberOfSlides,
      slidesPerPage
    } = state.store as StateType
    const slides = slideNodeList(this.$root)

    let slideIndex = setSlideIndex({
      from: from!,
      currentSlideIndex,
      index
    })

    if (
      (!infinite && slideIndex > numberOfSlides - 1) ||
      (!infinite && slideIndex < 0)
    )
      return

    if (slideIndex > numberOfSlides + 1) slideIndex = slideIndex - 1
    if (slideIndex < 0) slideIndex = slideIndex + 1

    state.set(State_Keys.SlideIndex, slideIndex)

    setActiveSlide(slides, slideIndex, slidesPerPage)

    slider.setTransform()
  }
}

//const isClonedSlide = slideIndex === numberOfSlides - 1 || slideIndex <= 0
/* if (isClonedSlide) {
  }*/

//if (isInfinite && slidesPerPage <= 1) {
//}
