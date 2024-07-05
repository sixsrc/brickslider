import { BaseSlider } from "./BaseSlider"
import { ANIMATION_OPTIONS, CLASS_VALUES } from "./constants"
import {
  addClass,
  animateElement,
  calcTranslate,
  getSliderNodeList,
  translate3d
} from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

export class Slides extends BaseSlider {
  private slides: HTMLElement[] | null
  private clonedSlides: any[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clonedSlides = []
  }

  public cloneSlides(): void {
    const state = this.slidePositionState()

    this.duplicateSlides()
    this.setState(state)
    this.animate()
  }

  private duplicateSlides() {
    let { slidesPerPage } = this.store
    const sliderCount = this.slides!.length

    if (sliderCount < slidesPerPage) return

    slidesPerPage = Math.min(slidesPerPage, sliderCount)

    this.loopByClonedSlides(slidesPerPage, sliderCount)
  }

  private loopByClonedSlides(slidesPerPage: number, slideCount: number): void {
    const end = [...Array(slidesPerPage).keys()]
    const start = [...Array(slidesPerPage).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    for (const indices of [end, start]) {
      for (const index of indices) {
        const { $children, slides, clonedSlides } = this
        const clone = slides![index].cloneNode(true) as HTMLElement

        clonedSlides.push(clone)

        addClass(clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerPage
          ? $children?.appendChild(clone)
          : $children?.insertBefore(clone, slides![0])
      }
    }
  }

  protected setState(state: any) {
    this.state.set(state)
  }

  private slidePositionState() {
    const { $children } = this
    const { slideIndex } = this.store
    const translate = this.calcTranslate($children)

    return {
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: slideIndex + 1
    }
  }

  private calcTranslate($children: HTMLElement) {
    const { slideIndex, spacing } = this.store

    return calcTranslate($children!, spacing, slideIndex + 1)
  }

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [{ transform: translate3d(currentTranslate) }]
  }
  private options(): Partial<AnimationOptions> {
    return {
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }
}
