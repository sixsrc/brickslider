import { BaseSlider } from "./BaseSlider"
import { ATTRIBUTES, CLASS_VALUES } from "./helpers"
import {
  addClass,
  appendToParent,
  getSliderNodeList,
  insertBefore,
  setAttribute
} from "./helpers"
import { Mount } from "./Mount"
import { Slider } from "./Slider"
import type { ResponsiveInput, ResponsiveOption, StateType } from "./types"

export class CloneSlides extends BaseSlider {
  protected slides: HTMLElement[]
  private clonedSlides: HTMLElement[]
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
    const { useLoop } = this.store
    const translate = this.calcTranslate()
    const index = useLoop ? this.slider.getInitialIndexFromClones() : 0

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
    const dataIndex = original.getAttribute(ATTRIBUTES.DATA_INDEX)!

    setAttribute(clone, ATTRIBUTES.DATA_INDEX, dataIndex)
  }

  private syncSlideNumbers(): void {
    const slides = this.getMountedSlides()

    slides.forEach((slide, index) => {
      setAttribute(slide, ATTRIBUTES.DATA_NUMBER, String(index + 1))
    })
  }

  private getMountedSlides(): HTMLElement[] {
    return getSliderNodeList(this.$root)
  }

  protected calcTranslate(): number {
    const slides = getSliderNodeList(this.$root)
    const { gap } = this.store

    this.checkDataIndex(slides)
    this.setTotalWidth(gap)

    return -this.totalWidthBefore
  }

  private checkDataIndex(slides: HTMLElement[]): void {
    this.slidesBefore = []

    for (const slide of slides) {
      this.dataIndex = slide.getAttribute("data-index") as string

      if (this.dataIndex !== "1") this.slidesBefore.push(slide)
      else break
    }
  }

  private setTotalWidth(gap: number): void {
    this.totalWidthBefore = this.slidesBefore.reduce((acc, slide) => {
      return acc + slide.offsetWidth + gap
    }, 0)
  }

  private setTranslate(): void {
    this.animate(this.$children, this.keyFrames(), this.options())
  }
}
