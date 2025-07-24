import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, removeClass } from "./helpers"
import { Slider } from "./Slider"

export class Mutate extends BaseSlider {
  private activeIndex: number

  constructor($root: string) {
    super($root)
    this.activeIndex = 0
  }

  public updateActiveSlides(slideMov: string | null = null): void {
    this.startUpdate(slideMov)
    this.resetActiveClasses(this.getSlides())
    this.activateSlides(this.getSlides(), this.activeIndex)
  }

  private getSlides(): HTMLElement[] {
    const slides = Slider.getSlides(this.$root)
    return slides
  }

  private startUpdate(slideMov: string | null = null): void {
    const startIndex = this.calculateStartIndex(this.getSlides(), slideMov)
    this.activeIndex = startIndex
  }

  private calculateStartIndex(
    slides: HTMLElement[],
    slideMovement: string | null
  ): number {
    let baseIndex = slides.findIndex(slide => slide.dataset.index === "1")

    if (!slideMovement) return baseIndex

    return this.setTargetIndex(slides, slideMovement, baseIndex)
  }

  private setTargetIndex(
    slides: HTMLElement[],
    slideMovement: string,
    baseIndex: number
  ): number {
    const isIncrement = slideMovement === "increment"
    const adjustedSlides = this.getAdjustedSlides()
    const indexFromData = this.getFirstSlideIndex(slides)

    if (!isIncrement) {
      baseIndex = this.adjustBaseIndexForDecrement(indexFromData)
    }

    const relative = this.activeIndex - baseIndex

    let target = this.calculateTargetIndex(
      relative,
      adjustedSlides,
      isIncrement
    )

    return this.getClampedTargetIndex(baseIndex, target, slides.length)
  }
  private getAdjustedSlides(): number {
    const { slidesPerView, slidesPerPage } = this.store
    return Math.min(slidesPerView, slidesPerPage)
  }

  private getFirstSlideIndex(slides: HTMLElement[]): number {
    return slides.findIndex(slide => slide.dataset.index === "1")
  }

  private adjustBaseIndexForDecrement(indexFromData: number): number {
    const { activePage, leftOverSlides } = this.store
    const { leftOver } = this.getMissingSlides()

    if (leftOverSlides > 0) {
      this.activeIndex += leftOver
      this.setState({ leftOverSlides: 0 })
    }

    return activePage === 0 ? indexFromData : 0
  }

  private calculateTargetIndex(
    relative: number,
    adjustedSlides: number,
    isIncrement: boolean
  ): number {
    const { infinite, leftOverSlides, activePage } = this.store
    let target = relative + (isIncrement ? adjustedSlides : -adjustedSlides)

    if (isIncrement && !infinite && leftOverSlides > 0) {
      target -= 1
    }

    console.log("Active Page:", activePage)

    return target
  }

  private getClampedTargetIndex(
    baseIndex: number,
    target: number,
    totalSlides: number
  ): number {
    const { slidesPerPage, infinite } = this.store
    const min = infinite ? baseIndex + slidesPerPage : baseIndex
    const max = totalSlides - slidesPerPage

    console.log({
      baseIndex,
      target,
      totalSlides,
      slidesPerPage,
      min,
      max,
      isInfinite: infinite
    })

    return Math.max(min, Math.min(max, baseIndex + target))
  }

  private resetActiveClasses(slides: HTMLElement[]): void {
    slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))
  }

  private activateSlides(slides: HTMLElement[], startIndex: number): void {
    const { slidesPerPage } = this.store
    let index = 0

    Array.from({ length: slidesPerPage }).forEach((_, i) => {
      index = startIndex + i

      if (index < slides.length) addClass([slides[index]], CLASS_VALUES.ACTIVE)
    })
  }
}
