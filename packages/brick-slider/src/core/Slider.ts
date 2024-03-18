import { addClass } from "@/dom/addClass"
import { getAllElements } from "@/dom/getAllElements"
import { getDotsSelector } from "@/dom/getDotsSelector"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { hasClass } from "@/dom/hasClass"
import { removeClass } from "@/dom/removeClass"
import { State, StateType, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { CLASS_VALUES, TAGS } from "@/util/constants"
import { setActiveClass } from "@/util/setActiveClass"

export type SetCurrentSlideType = {
  from?: "dots" | "prev" | "next" | "touch"
  index?: number
  $root: string | ""
}

export class Slider {
  private state: State
  private store: StateType

  constructor(private $root: string) {
    this.$root = $root
    this.store = State.store(this.$root)
    this.state = new State(this.$root)
  }

  public setCurrentSlide(
    params: {
      from?: "next" | "prev" | "next" | "touch"
      index?: number
      $root: string
    } = {
      $root: ""
    }
  ): void {
    const { index, from } = params!

    const currentSlideIndex = this.state.get(State_Keys.SlideIndex)
    const { infinite, numberOfSlides } = this.store

    let currentIndex = this.updateIndex({
      from: from!,
      currentSlideIndex,
      index
    })

    if (!infinite && currentIndex > numberOfSlides - 1) return
    if (!infinite && currentIndex < 0) return
    if (currentIndex > currentIndex + 1) currentIndex = currentIndex - 1
    if (currentIndex < 0) currentIndex = currentIndex + 1

    this.state.seti({ [State_Keys.SlideIndex]: currentIndex })

    setActiveClass(
      getSlideNodeList(this.$root),
      currentIndex,
      this.store[State_Keys.SlidesPerPage]
    )

    transformSlider(this.$root)
  }

  private updateIndex(params: {
    from: string
    currentSlideIndex: number
    index?: number
  }) {
    const { from, currentSlideIndex, index } = params

    switch (from) {
      case "next":
        return currentSlideIndex + 1
      case "prev":
        return currentSlideIndex - 1
      case "dots":
      case "touch":
        return index ?? currentSlideIndex
      default:
        return currentSlideIndex
    }
  }

  public updateDots(index: number, $root: string): void {
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))
    const selectedIndex = index ?? 0

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
    })
  }
}

/*IMPORTANTE REALOCAR ISSO DEPOIS

 if (!infinite && currentIndex > numberOfSlides - 1) return
    if (!infinite && currentIndex < 0) return
    if (currentIndex > currentIndex + 1) currentIndex = currentIndex - 1
    if (currentIndex < 0) currentIndex = currentIndex + 1/*



//const isClonedSlide = slideIndex === numberOfSlides - 1 || slideIndex <= 0
/* if (isClonedSlide) {
  }*/

//if (isInfinite && slidesPerPage <= 1) {
//}

/*  const {
  slideIndex: currentSlideIndex,
  infinite,
  numberOfSlides,
  slidesPerPage
} = this.state.store as StateType*/
