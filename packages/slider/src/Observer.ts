import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES, hasClass } from "./helpers"

export class Observer extends BaseSlider {
  private visibleIndexes = new Set<number>()
  private visibleDataIndexes = new Set<number>()
  private elementToIndexMap = new Map<HTMLElement, number>()
  private animationFrameId: number | null = null
  private lastIndex = 0

  constructor($root: string) {
    super($root)
    this.observeSlides()
    this.startObserving()
  }

  private observeSlides(): void {
    const { useLoop } = this.store

    this.slides.forEach((slide, index) => {
      if (useLoop) {
        this.elementToIndexMap.set(slide, index)
      }
    })
  }

  private startObserving(): void {
    const check = () => {
      this.checkVisibleSlides()
      this.animationFrameId = requestAnimationFrame(check)
    }
    this.animationFrameId = requestAnimationFrame(check)
  }

  private checkVisibleSlides(): void {
    const visibleSlides = this.getVisibleSlides()
    const newlyVisibleIndexes = this.getVisibleIndexes(visibleSlides)
    const newlyVisibleDataIndexes = this.getVisibleDataIndexSet(visibleSlides)
    const hasVisibleSlidesChanged = this.hasVisibleSlidesChanged(
      newlyVisibleIndexes,
      newlyVisibleDataIndexes
    )

    if (!hasVisibleSlidesChanged) return

    this.updateVisibleSlides(newlyVisibleIndexes, newlyVisibleDataIndexes)
  }

  private getVisibleSlides(): HTMLElement[] {
    const trackRect = this.$track.getBoundingClientRect()

    return this.slides.filter(slide => this.isSlideVisible(slide, trackRect))
  }

  private isSlideVisible(slide: HTMLElement, trackRect: DOMRect): boolean {
    const ratio = this.getSlideVisibleRatio(slide, trackRect)
    const slideNumber = this.getSlideNumber(slide)
    const index = this.getSlideIndex(slide, slideNumber)

    return ratio >= 0.75 && index !== -1 && slideNumber !== -1
  }

  private getSlideVisibleRatio(slide: HTMLElement, trackRect: DOMRect): number {
    const rect = slide.getBoundingClientRect()
    const visibleWidth =
      Math.min(rect.right, trackRect.right) -
      Math.max(rect.left, trackRect.left)

    return visibleWidth / rect.width
  }

  private getVisibleIndexes(visibleSlides: HTMLElement[]): Set<number> {
    return new Set(
      visibleSlides.map(slide => {
        const slideNumber = this.getSlideNumber(slide)

        return this.getSlideIndex(slide, slideNumber)
      })
    )
  }

  private getVisibleDataIndexSet(visibleSlides: HTMLElement[]): Set<number> {
    return new Set(visibleSlides.map(slide => this.getSlideNumber(slide)))
  }

  private getSlideNumber(slide: HTMLElement): number {
    return parseInt(slide.dataset.slideNumber || "-1")
  }

  private getSlideIndex(slide: HTMLElement, slideNumber: number): number {
    const { useLoop } = this.store

    if (useLoop) return this.elementToIndexMap.get(slide) ?? -1

    return slideNumber - 1
  }

  private hasVisibleSlidesChanged(
    newlyVisibleIndexes: Set<number>,
    newlyVisibleDataIndexes: Set<number>
  ): boolean {
    return (
      this.setsDiffer(this.visibleIndexes, newlyVisibleIndexes) ||
      this.setsDiffer(this.visibleDataIndexes, newlyVisibleDataIndexes)
    )
  }

  private updateVisibleSlides(
    newlyVisibleIndexes: Set<number>,
    newlyVisibleDataIndexes: Set<number>
  ): void {
    this.visibleIndexes = newlyVisibleIndexes
    this.visibleDataIndexes = newlyVisibleDataIndexes
    this.updateLastIndex()
  }

  private setsDiffer(a: Set<number>, b: Set<number>): boolean {
    if (a.size !== b.size) return true
    for (const val of a) {
      if (!b.has(val)) return true
    }
    return false
  }

  protected updateLastIndex(): void {
    if (this.visibleDataIndexes.size > 0) {
      const sorted = [...this.visibleDataIndexes].sort((a, b) => a - b)
      const { slidesPerPage } = this.store
      const limited = sorted.slice(0, slidesPerPage)
      const adjustedLast = limited[limited.length - 1]

      this.lastIndex = adjustedLast
      this.setState(this.setActiveDataIndexState())
    }
  }

  private setActiveDataIndexState(): { activeDataIndex: number } {
    return {
      activeDataIndex: this.lastIndex
    }
  }

  public getVisibleSlideIndexes(): number[] {
    return [...this.visibleIndexes].sort((a, b) => a - b)
  }

  public getVisibleDataIndexes(): number[] {
    return [...this.visibleDataIndexes].sort((a, b) => a - b)
  }

  public getLastVisibleDataIndex(): number {
    return this.lastIndex
  }

  public destroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }
  }
}
