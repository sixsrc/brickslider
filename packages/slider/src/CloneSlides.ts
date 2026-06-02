import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass } from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider-ORIGINAL"
import { StateType } from "./State"

export class CloneSlides extends BaseSlider {
  private slides: HTMLElement[]
  private clonedSlides: any[]
  private mount: Mount | undefined
  private dataIndex: string
  private totalWidthBefore: number
  private slidesBefore: HTMLElement[] = []
  private slider: Slider

  constructor($root: string) {
    super($root)
    this.slides = []
    this.slider = new Slider($root)
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
    let { slidesPerView, slidesPerPage } = this.store
    let qtySlidesToClone = slidesPerView * 2

    this.slides = Slider.getSlides($root)

    if (childrenCount < slidesPerView) return
    if (slidesPerView < slidesPerPage) qtySlidesToClone = slidesPerPage

    slidesPerView = Math.min(slidesPerView, childrenCount)

    this.loopByClonedSlides(qtySlidesToClone, childrenCount)
  }

  private loopByClonedSlides(slidesPerView: number, slideCount: number): void {
    const end = [...Array(slidesPerView).keys()]
    const start = [...Array(slidesPerView).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    this.mountClonedSlides(end, start)
  }

  private slidePositionState(): Partial<StateType> {
    const { infinite } = this.store
    const translate = this.calcTranslate()
    const index = infinite ? this.slider.getInitialIndexFromClones() : 0

    return {
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: index,
      isInitialRender: false
    }
  }

  /*private mountClonedSlides(end: number[], start: number[]): void {
    for (const index of start) {
      const original = this.slides[index]
      const clone = original.cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)

      const dataIndex = original.getAttribute("data-index")
      if (dataIndex) clone.setAttribute("data-index", dataIndex)

      this.$children?.insertBefore(clone, this.slides[0])
      this.clonedSlides.push(clone)
    }

    for (const index of end) {
      const original = this.slides[index]
      const clone = original.cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)

      const dataIndex = original.getAttribute("data-index")
      if (dataIndex) clone.setAttribute("data-index", dataIndex)

      this.$children?.appendChild(clone)
      this.clonedSlides.push(clone)
    }

    this.mount = new Mount(this.$root)
    this.mount.setSlidesWidth()
  }*/

  private mountClonedSlides(end: number[], start: number[]): void {
    // Clonar antes (início)
    for (const index of start) {
      const original = this.slides[index]
      const clone = original.cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)

      // data-index do clone = data-index do original
      clone.setAttribute("data-index", original.getAttribute("data-index")!)

      this.$children?.insertBefore(clone, this.slides[0])
      this.clonedSlides.push(clone)
    }

    // Clonar depois (fim)
    for (const index of end) {
      const original = this.slides[index]
      const clone = original.cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)

      // data-index do clone = data-index do original
      clone.setAttribute("data-index", original.getAttribute("data-index")!)

      this.$children?.appendChild(clone)
      this.clonedSlides.push(clone)
    }

    // Agora, percorre TODOS os slides no DOM (originais + clones)
    // e atribui data-slide-number na ordem do DOM (1, 2, 3, ...)
    const allSlides = Array.from(this.$children!.children) as HTMLElement[]
    allSlides.forEach((slide, i) => {
      slide.setAttribute("data-slide-number", (i + 1).toString())
    })

    this.mount = new Mount(this.$root)
    this.mount.setSlidesWidth()
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
