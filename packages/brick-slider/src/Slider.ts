import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
import { CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  indexBasedBy,
  isNotMapped,
  removeClass,
  toggleClass,
  transform
} from "./helpers"

type TypeTargetSlideParams = {
  from: "next" | "prev" | "dots" | "touch"
  touchIndex?: number
  $root: string
}

export class Slider extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    const { touchIndex, from } = params!
    const { infinite, numberOfSlides, slideIndex, slidesPerPage } = this.store

    let currentIndex = indexBasedBy({
      from,
      slideIndex,
      touchIndex
    })

    if (isNotMapped(infinite, currentIndex, numberOfSlides)) return

    this.state.set({ [State_Keys.SlideIndex]: currentIndex })

    toggleClass(getSliderNodeList(this.$root), currentIndex, slidesPerPage)

    transform(this.$root)
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
