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
    let { slidesPerView } = this.store
    this.slides = Slider.getSlides($root)

    if (childrenCount < slidesPerView) return

    // Clone all slides for a truly infinite effect
    // We add a special peek handling to ensure no empty spaces
    this.loopByClonedSlides(childrenCount, childrenCount, true)
  }

  /*private loopByClonedSlides(
    slidesPerView: number,
    slideCount: number,
    addPeekSlides: boolean = false
  ): void {
    // Create arrays with indexes of all slides to clone them at both ends
    const end = [...Array(slideCount).keys()]
    const start = [...Array(slideCount).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    // For peek style, add one extra slide at each end
    if (addPeekSlides) {
      // Add an extra slide at the beginning (last slide)
      start.unshift(slideCount - 1) // <- Use unshift em vez de push para início

      // Add an extra slide at the end (first slide)
      end.push(0)
    }

    this.mountClonedSlides(slidesPerView, end, start)
  }
*/

  /* private loopByClonedSlides(
    slidesPerView: number,
    slideCount: number,
    addPeekSlides: boolean = false
  ): void {
    // Create arrays with indexes of all slides to clone them at both ends
    const end = [...Array(slideCount).keys()]
    const start = [...Array(slideCount).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    // Add two extra slides at the beginning and the end
    start.unshift(slideCount - 2, slideCount - 1) // Clone the last two slides at the start
    end.push(0, 1) // Clone the first two slides at the end

    this.mountClonedSlides(slidesPerView, end, start)
  }*/

  private loopByClonedSlides(
    slidesPerView: number,
    slideCount: number,
    addPeekSlides: boolean = false
  ): void {
    // Create arrays with indexes of all slides to clone them at both ends
    const end = [...Array(slideCount).keys()]
    const start = [...Array(slideCount).keys()]
      .map(i => slideCount - i - 1)
      .reverse()

    // For peek style, add one extra slide at each end
    if (addPeekSlides) {
      // Add an extra slide at the beginning (last slide)
      start.unshift(slideCount - 1) // <- Use unshift em vez de push para início

      // Add an extra slide at the end (first slide)
      end.push(0)
    }

    this.mountClonedSlides(slidesPerView, end, start)
  }

  private mountClonedSlides(
    slidesPerView: number,
    end: number[],
    start: number[]
  ): void {
    // Clone slides to the beginning
    for (const index of start) {
      const clone = this.slides[index].cloneNode(true) as HTMLElement
      addClass([clone], CLASS_VALUES.CLONED)
      this.$children?.insertBefore(clone, this.slides[0])
      this.clonedSlides.push(clone)
    }

    // Clone slides to the end
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

  /*private checkDataIndex(allSlides: HTMLElement[]): void {
    this.slidesBefore = []
    for (const slide of allSlides) {
      this.dataIndex = slide.getAttribute("data-index") || "0"
      if (this.dataIndex !== "1") this.slidesBefore.push(slide)
      else break
    }
  }*/

  private checkDataIndex(allSlides: HTMLElement[]): void {
    this.slidesBefore = []
    let indexCounter = 0

    for (const slide of allSlides) {
      const currentDataIndex = slide.getAttribute("data-index") || "0"

      if (currentDataIndex === "1") {
        indexCounter += 1
        // Captura quando encontrar o segundo slide com "data-index" === "1"
        if (indexCounter === 3) {
          this.dataIndex = currentDataIndex
          break
        }
      }

      // Adiciona apenas slides anteriores ao segundo "data-index"
      this.slidesBefore.push(slide)
    }
  }

  private setTotalWidth(spacing: number): void {
    this.totalWidthBefore = this.slidesBefore.reduce((acc, slide) => {
      return acc + slide.offsetWidth + spacing
    }, 0)

    console.log("totalwidthbefore", this.totalWidthBefore)
  }

  private setTranslate(): void {
    this.animate(this.$children, this.keyFrames(), this.options())
  }
}
