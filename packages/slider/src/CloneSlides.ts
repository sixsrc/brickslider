import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, calcTranslate, getSliderNodeList } from "./helpers"

export class CloneSlides extends BaseSlider {
  private slides: HTMLElement[] | null
  private clonedSlides: any[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clonedSlides = []
  }

  public init(): void {
    this.duplicateSlides()
    this.setState(this.slidePositionState())
    this.animate(this.keyFrames(), this.options())
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

  private slidePositionState() {
    const { slideIndex } = this.store
    const translate = this.calcTranslate()

    return {
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: slideIndex + 1
    }
  }

  protected calcTranslate() {
    const { slideIndex, spacing } = this.store
    const { $children } = this

    return calcTranslate($children!, spacing, slideIndex + 1)
  }
}
