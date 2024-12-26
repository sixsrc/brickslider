import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, calcTranslate, getSliderNodeList } from "./helpers"
import { Mount } from "./Mount"
import { StateType } from "./State"

export class CloneSlides extends BaseSlider {
  private slides: HTMLElement[]
  private clonedSlides: any[]
  private mount: Mount | undefined

  constructor($root: string) {
    super($root)
    this.slides = []
    this.clonedSlides = []
  }

  public init(): void {
    this.duplicateSlides()
    this.setState(this.slidePositionState())
    this.setTranslate()
  }

  private duplicateSlides(): HTMLElement[] | undefined {
    const { $root, childrenCount } = this
    let { slidesPerView } = this.store

    this.setSlides($root)

    if (childrenCount < slidesPerView) return

    slidesPerView = Math.min(slidesPerView, childrenCount)

    this.loopByClonedSlides(slidesPerView, childrenCount)
  }

  private loopByClonedSlides(slidesPerView: number, slideCount: number): void {
    const end = [...Array(slidesPerView).keys()]
    const start = [...Array(slidesPerView).keys()]
      .map(i => slideCount - i - 1)
      .reverse()
    const { $root } = this

    for (const indices of [end, start]) {
      for (const index of indices) {
        const { $children, slides, clonedSlides } = this
        const clone = slides![index].cloneNode(true) as HTMLElement

        clonedSlides.push(clone)

        addClass(clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerView
          ? $children?.appendChild(clone)
          : $children?.insertBefore(clone, slides![0])

        this.mount = new Mount($root)

        this.mount.setWAAPIStyles()
      }
    }
  }

  private slidePositionState(): Partial<StateType> {
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

  private setSlides($root: string) {
    this.slides = getSliderNodeList($root)
  }

  public getSlides(): any {
    const { slides } = this

    return { slides }
  }

  private setTranslate() {
    this.animate(this.$children, this.keyFrames(), this.options())
  }
}
