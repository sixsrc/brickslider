import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES, getSliderNodeList } from "./helpers"
import { addClass, removeClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  private getAllSlides(): HTMLElement[] {
    return getSliderNodeList(this.$root)
  }

  public updateActiveSlides(
    visibleIndexes: number[] | null,
    maxActive?: number
  ): void {
    const slides = this.getAllSlides()
    const activeIndexes = this.getActiveIndexes(visibleIndexes, maxActive)

    if (!activeIndexes) return

    this.syncActiveSlides(slides, activeIndexes)
  }

  private syncActiveSlides(slides: HTMLElement[], activeIndexes: number[]): void {
    this.resetActiveClasses()
    this.applyActiveSlides(slides, activeIndexes)
  }

  private getActiveIndexes(
    visibleIndexes: number[] | null,
    maxActive?: number
  ): number[] | null {
    if (!visibleIndexes) return null

    return maxActive !== undefined
      ? visibleIndexes.slice(0, maxActive)
      : visibleIndexes
  }

  private applyActiveSlides(
    slides: HTMLElement[],
    activeIndexes: number[]
  ): void {
    slides.forEach((slide, index) => {
      this.toggleActiveSlide(slide, activeIndexes.includes(index))
    })
  }

  private toggleActiveSlide(slide: HTMLElement, isActive: boolean): void {
    if (isActive) {
      addClass([slide], CLASS_VALUES.ACTIVE)
      return
    }

    removeClass(slide, CLASS_VALUES.ACTIVE)
  }

  private resetActiveClasses(): void {
    this.slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))
  }
}
