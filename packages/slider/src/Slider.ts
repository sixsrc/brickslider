import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { CLASS_VALUES, TAGS, TIMES } from "./constants"
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
  toggleClass
} from "./helpers"
import { TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: any
  private currentIndex: number
  private translate: number

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.translate = 0
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    this.setIndexBased(params)
    this.mapSlideIndex() ? null : this.nextAction()
  }

  private nextAction() {
    this.animationFrame()
    this.calcTranslate()
    this.setState(this.mainState())
    this.updateDOM()
  }

  private setIndexBased(params: TypeTargetSlideParams): void {
    let { slideIndex, infinite } = this.store

    let { touchIndex, from } = params!

    if (touchIndex !== undefined) {
      if (infinite && from === "dots") {
        touchIndex = touchIndex + 1
      }
    }

    this.currentIndex = indexBasedBy({ from, slideIndex, touchIndex })

    console.log(" this.currentIndex", this.currentIndex)
  }

  private mapSlideIndex(): boolean {
    const { infinite, numberOfSlides } = this.store

    return isNotMapped(infinite, this.currentIndex, numberOfSlides)
  }

  private animationFrame() {
    requestAnimationFrame(this.animation.init)
  }

  protected calcTranslate(): number {
    const { spacing } = this.store
    const { $children, currentIndex } = this

    this.translate = calcTranslate($children!, spacing, currentIndex)

    return this.translate
  }

  private mainState(): Partial<StateType> {
    const { currentIndex, translate } = this

    return {
      slideIndex: currentIndex,
      prevTranslate: translate,
      currentTranslate: translate
    }
  }

  protected updateDOM(): void {
    const { slidesPerPage } = this.store
    const { $root, currentIndex } = this

    toggleClass(getSliderNodeList($root), currentIndex, slidesPerPage)
  }

  public updateDots(index: number, $root: string): void {
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))
    const selectedIndex = index ?? 0

    console.log("selectedIndex", selectedIndex)

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
    })
  }
}
