import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass } from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider"
import { StateType } from "./State"

export class CloneSlides extends BaseSlider {
  private slides: HTMLElement[]
  private clonedSlides: any[]
  private mount: Mount | undefined
  private dataIndex: string
  private totalWidthBefore: number
  private slidesBefore: HTMLElement[] = []

  constructor($root: string) {
    super($root)
    this.slides = []
    this.clonedSlides = []
    this.dataIndex = "0"
    this.totalWidthBefore = 0
    this.slidesBefore = []
  }

  public init(): void {
    this.duplicateSlides()
    this.setState(this.slidePositionState())
    this.setTranslate()
  }

  private duplicateSlides(): HTMLElement[] | undefined {
    const { $root, childrenCount } = this
    let { slidesPerView } = this.store

    this.slides = Slider.getSlides($root)

    if (childrenCount < slidesPerView) return

    slidesPerView = Math.min(slidesPerView, childrenCount)

    this.loopByClonedSlides(slidesPerView + 1, childrenCount)
  }

  private loopByClonedSlides(slidesPerView: number, slideCount: number): void {
    const end = [...Array(slidesPerView).keys()]
    const start = [...Array(slidesPerView).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    this.mountClonedSlides(slidesPerView, end, start)
  }

  private mountClonedSlides(
    slidesPerView: number,
    end: number[],
    start: number[]
  ): void {
    for (const indices of [end, start]) {
      for (const index of indices) {
        const clone = this.slides![index].cloneNode(true) as HTMLElement

        this.clonedSlides.push(clone)

        addClass(this.clonedSlides, CLASS_VALUES.CLONED)

        index < slidesPerView
          ? this.$children?.appendChild(clone)
          : this.$children?.insertBefore(clone, this.slides![0])

        this.mount = new Mount(this.$root)

        this.mount.setSlidesWidth()
      }
    }
  }

  private slidePositionState(): Partial<StateType> {
    const { slideIndex } = this.store
    const translate = this.calcTranslate()

    return {
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: slideIndex + 1,
      isInitialRender: false
    }
  }

  protected calcTranslate() {
    const slides = Slider.getSlides(this.$root)
    const allSlides = Array.from(slides)
    const { spacing } = this.store

    this.checkDataIndex(allSlides)
    this.setTotalWidth(spacing)

    return -this.totalWidthBefore
  }

  private checkDataIndex(allSlides: HTMLElement[]) {
    for (const slide of allSlides) {
      this.dataIndex = slide.getAttribute("data-index") as string

      if (this.dataIndex !== "1") this.slidesBefore.push(slide)
      else break
    }
  }

  private setTotalWidth(spacing: number) {
    this.totalWidthBefore = this.slidesBefore.reduce((acc, slide) => {
      return acc + slide.offsetWidth + spacing
    }, 0)
  }

  private setTranslate() {
    this.animate(this.$children, this.keyFrames(), this.options())
  }
}

/* private setSlides($root: string) {
    this.slides = getSliderNodeList($root)
  }

  public getSlides(): any {
    const { slides } = this

    return { slides }
  }*/
/* protected calcTranslate() {
    const { slideIndex, spacing } = this.store
    const { $children } = this

    return calcTranslate($children!, spacing, slideIndex + 1)
  }*/
