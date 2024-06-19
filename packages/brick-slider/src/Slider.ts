import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
import { CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
  calcTranslate,
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
import { TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: any

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
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

    requestAnimationFrame(this.animation.init)

    // transform(this.$root)

    const { currentTranslate, spacing } = this.store

    const translate = calcTranslate(this.$children!, spacing, slideIndex)

    this.state.set({
      [State_Keys.PrevTranslate]: translate,
      [State_Keys.CurrentTranslate]: translate
    })

    this.$children.animate(
      [
        {
          transform: `translate3d(${currentTranslate}px, 0px, 0px)`
        },
        {
          transform: `translate3d(${currentTranslate * currentIndex}px, 0px, 0px)`
        }
      ],
      {
        duration: 0,
        easing: "ease"
        //fill: "forwards"
      }
    )
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
