import { addClass } from "@/dom/addClass"
import { getAllElements } from "@/dom/getAllElements"
import { getDotsSelector } from "@/dom/getDotsSelector"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { hasClass } from "@/dom/hasClass"
import { removeClass } from "@/dom/removeClass"
import { transform as transformSlider } from "@/transition/transform"
import { CLASS_VALUES, TAGS } from "@/util/constants"
import { toggleActiveClass } from "@/util/toggleActiveClass"
import { Base } from "./Base"
import { State_Keys } from "@/state/BrickState"
import { isNotMapped } from "@/util/isNotMapped"
import { indexBasedBy } from "@/util/indexBasedBy"

type TypeTargetSlideParams = {
  from?: "next" | "prev" | "next" | "touch"
  touchIndex?: number
  $root: string
}

export class Slider extends Base {
  constructor($root: string) {
    super($root)
  }

  public setTargetSlide(params: TypeTargetSlideParams = { $root: "" }): void {
    const { touchIndex, from } = params!

    const { infinite, numberOfSlides, slideIndex, slidesPerPage } = this.store

    const updateIndexObj = {
      from: from!,
      slideIndex,
      touchIndex
    }

    let currentIndex = indexBasedBy(updateIndexObj)

    if (!isNotMapped(infinite, currentIndex, numberOfSlides)) return

    this.state.set({ [State_Keys.SlideIndex]: currentIndex })

    toggleActiveClass(getSlideNodeList(this.$root), currentIndex, slidesPerPage)

    transformSlider(this.$root)
  }

  public static updateDots(index: number, $root: string): void {
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))

    const selectedIndex = index ?? 0

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
    })
  }
}
