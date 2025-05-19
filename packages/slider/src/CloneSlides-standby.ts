import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass } from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider"
import { StateType } from "./State"

export class CloneSlides extends BaseSlider {
  private slides: HTMLElement[]
  private clonedSlides: HTMLElement[]
  private mount: Mount | undefined
  private dataIndex: string
  private totalWidthBefore: number
  private slidesBefore: HTMLElement[]

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

  private duplicateSlides(): void {
    const { $root, childrenCount } = this
    const { slidesPerView, slidesPerPage } = this.store

    this.slides = Slider.getSlides($root)

    if (childrenCount < slidesPerView) return

    // Número de slides necessários para cobrir uma página adicional
    const extraSlidesNeeded = slidesPerView + 1 //slidesPerPage + 5

    // Adicionar clones suficientes ao início e ao final
    this.loopByClonedSlides(extraSlidesNeeded, childrenCount, extraSlidesNeeded)
  }

  private loopByClonedSlides(
    slidesPerPage: number,
    slideCount: number,
    extraSlides: number
  ): void {
    const end = [...Array(extraSlides).keys()].map(i => i % slideCount)
    const start = [...Array(extraSlides).keys()]
      .map(i => (slideCount - i - 1) % slideCount)
      .reverse()

    this.mountClonedSlides(slidesPerPage, end, start)
  }

  private mountClonedSlides(
    slidesPerPage: number,
    end: number[],
    start: number[]
  ): void {
    // Clone slides para o início
    for (const index of start) {
      const clone = this.slides[index].cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)
      this.$children?.insertBefore(clone, this.slides[0])
      this.clonedSlides.push(clone)
    }

    // Clone slides para o final
    for (const index of end) {
      const clone = this.slides[index].cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)
      this.$children?.appendChild(clone)
      this.clonedSlides.push(clone)
    }

    this.mount = new Mount(this.$root)
    this.mount.setSlidesWidth()
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

  protected calcTranslate(): number {
    const slides = Slider.getSlides(this.$root)
    const allSlides = Array.from(slides)
    const { spacing } = this.store

    this.checkDataIndex(allSlides)
    this.setTotalWidth(spacing)

    return -this.totalWidthBefore
  }

  private checkDataIndex(allSlides: HTMLElement[]): void {
    this.slidesBefore = []
    for (const slide of allSlides) {
      this.dataIndex = slide.getAttribute("data-index") || "0"
      if (this.dataIndex !== "1") this.slidesBefore.push(slide)
      else break
    }
  }

  /* private checkDataIndex(allSlides: HTMLElement[]): void {
    this.slidesBefore = []
    let indexCounter = 0

    for (const slide of allSlides) {
      const currentDataIndex = slide.getAttribute("data-index") || "0"

      if (currentDataIndex === "1") {
        indexCounter += 1
        // Captura quando encontrar o segundo slide com "data-index" === "1"
        if (indexCounter === 1) {
          this.dataIndex = currentDataIndex
          break
        }
      }

      // Adiciona apenas slides anteriores ao segundo "data-index"
      this.slidesBefore.push(slide)
    }
  }*/

  private setTotalWidth(spacing: number): void {
    this.totalWidthBefore = this.slidesBefore.reduce((acc, slide) => {
      return acc + slide.offsetWidth + spacing
    }, 0)
  }

  private setTranslate(): void {
    this.animate(this.$children, this.keyFrames(), this.options())
  }
}
