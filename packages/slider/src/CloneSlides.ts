import { BaseSlider } from "./BaseSlider"
import { StateKey } from "./State"
import { CLASS_VALUES } from "./helpers"
import {
  addClass,
  appendToParent,
  getSliderNodeList,
  insertBefore
} from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider"
import type { ResponsiveInput, ResponsiveOption, StateType } from "./types"
import { SlideMeta } from "./SlideMeta"

export class CloneSlides extends BaseSlider {
  protected slides: HTMLElement[]
  private clonedSlides: HTMLElement[]
  private mount: Mount | undefined
  private slider: Slider
  private slideMeta: SlideMeta

  constructor($root: string) {
    super($root)
    this.slides = []
    this.slider = new Slider($root)
    this.clonedSlides = []
    this.slideMeta = new SlideMeta($root)
  }

  public init(): void {
    this.duplicateSlides()
    this.setState(this.slidePositionState())
    this.setTranslate()
  }

  private duplicateSlides(): HTMLElement[] | undefined {
    const { $root, childrenCount } = this
    const { slidesPerView } = this.store
    const qtySlidesToClone = this.getCloneQuantity()

    if (childrenCount < slidesPerView) return

    this.slides = getSliderNodeList($root)
    this.loopByClonedSlides(qtySlidesToClone, childrenCount)
  }

  private getCloneQuantity(): number {
    const { slidesPerPage, slidesPerView } = this.store
    const maxResponsiveSlideCount = this.getMaxResponsiveSlideCount()
    const safeSlidesPerView = Math.max(slidesPerView, maxResponsiveSlideCount)
    const safeSlidesPerPage = Math.max(slidesPerPage, maxResponsiveSlideCount)

    return safeSlidesPerView < safeSlidesPerPage
      ? safeSlidesPerPage
      : safeSlidesPerView * 2
  }

  private getMaxResponsiveSlideCount(): number {
    const { responsive: rawResponsive } = this.store
    const responsive = rawResponsive as ResponsiveInput | undefined

    if (!responsive) return 0

    return Object.values(responsive).reduce((maxCount, option) => {
      const responsiveCount = this.getResponsiveCloneCount(option)

      return Math.max(maxCount, responsiveCount)
    }, 0)
  }

  private getResponsiveCloneCount(option?: ResponsiveOption): number {
    const slidesPerPage = option?.slidesPerPage ?? 0
    const slidesPerView = option?.slidesPerView ?? 0

    return Math.max(slidesPerPage, slidesPerView)
  }

  private loopByClonedSlides(
    qtySlidesToClone: number,
    childrenCount: number
  ): void {
    const end = [...Array(qtySlidesToClone).keys()]
    const start = [...Array(qtySlidesToClone).keys()]
      .map(i => childrenCount - i - 1)
      .reverse()

    this.mountClonedSlides(end, start)
  }

  private slidePositionState(): Partial<StateType> {
    const index = this.getInitialIndex()
    const translate = this.getInitialTranslate(index)

    return {
      currentTranslate: translate,
      prevTranslate: translate,
      slideIndex: index,
      isInitialRender: false
    }
  }

  private mountClonedSlides(end: number[], start: number[]): void {
    for (const index of start) {
      this.mountStartClone(index)
    }

    for (const index of end) {
      this.mountEndClone(index)
    }

    this.syncSlideNumbers()
    this.mount = new Mount(this.$root)
    this.mount.setSlidesWidth()
  }

  private mountStartClone(index: number): void {
    const clone = this.createClonedSlide(index)

    insertBefore(this.$children, clone, this.slides[0])
    this.clonedSlides.push(clone)
  }

  private mountEndClone(index: number): void {
    const clone = this.createClonedSlide(index)

    appendToParent(this.$children, clone)
    this.clonedSlides.push(clone)
  }

  private createClonedSlide(index: number): HTMLElement {
    const original = this.slides[index]
    const clone = original.cloneNode(true) as HTMLElement

    addClass([clone], CLASS_VALUES.CLONED)
    this.syncCloneDataIndex(clone, original)

    return clone
  }

  private syncCloneDataIndex(clone: HTMLElement, original: HTMLElement): void {
    const dataIndex = this.slideMeta.getSlideDataIndex(original)
    const slideNumber = this.getMountedSlides().length

    this.slideMeta.setSlideMeta(clone, dataIndex, slideNumber, true)
  }

  private syncSlideNumbers(): void {
    const slides = this.getMountedSlides()

    slides.forEach((slide, index) => {
      this.slideMeta.syncSlideNumber(slide, index)
    })
  }

  private getMountedSlides(): HTMLElement[] {
    return getSliderNodeList(this.$root)
  }

  private getInitialSlideIndex(): number {
    const initialSlide = this.store[StateKey.InitialSlide] ?? 0
    const totalSlides = getSliderNodeList(this.$root, false).length
    const maxIndex = Math.max(0, totalSlides - 1)

    return Math.max(0, Math.min(initialSlide, maxIndex))
  }

  private getInitialIndex(): number {
    const initialSlide = this.getInitialSlideIndex()
    const { useLoop } = this.store

    if (!useLoop) return initialSlide

    return this.slider.getInitialIndexFromClones() + initialSlide
  }

  private getInitialTranslate(index: number): number {
    const slides = getSliderNodeList(this.$root)
    const { gap } = this.store
    let translate = 0

    for (let position = 0; position < index; position++) {
      const slide = slides[position]

      if (slide) translate += slide.offsetWidth + gap
    }

    return -translate
  }

  private setTranslate(): void {
    this.animate(this.$children, this.keyFrames(), this.options())
  }
}
