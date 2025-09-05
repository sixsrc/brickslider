import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { hasClass } from "./helpers"

export class Observer extends BaseSlider {
  private visibleIndexes = new Set<number>()
  private visibleDataIndexes = new Set<number>()
  private elementToIndexMap = new Map<HTMLElement, number>()
  private animationFrameId: number | null = null

  constructor($root: string) {
    super($root)
    this.observeSlides()
    this.startObserving()
  }

  private observeSlides(): void {
    const slides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    this.slidesArr.forEach((slide, index) => {
      if (this.store.isInfinite) {
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
    const trackRect = this.$track.getBoundingClientRect()
    const slides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    const newlyVisibleIndexes = new Set<number>()
    const newlyVisibleDataIndexes = new Set<number>()
    const { isInfinite } = this.store

    this.slidesArr.forEach(slide => {
      const rect = slide.getBoundingClientRect()
      const visibleWidth =
        Math.min(rect.right, trackRect.right) -
        Math.max(rect.left, trackRect.left)
      const ratio = visibleWidth / rect.width

      const dataIndex = parseInt(slide.dataset.index || "-1")
      const slideNumber = parseInt(slide.dataset.slideNumber || "-1")
      const index = isInfinite
        ? (this.elementToIndexMap.get(slide) ?? -1)
        : slideNumber

      if (ratio >= 0.75 && index !== -1 && slideNumber !== -1) {
        newlyVisibleIndexes.add(index)
        newlyVisibleDataIndexes.add(slideNumber)
      }
    })

    const changed =
      this.setsDiffer(this.visibleIndexes, newlyVisibleIndexes) ||
      this.setsDiffer(this.visibleDataIndexes, newlyVisibleDataIndexes)

    if (changed) {
      this.visibleIndexes = newlyVisibleIndexes
      this.visibleDataIndexes = newlyVisibleDataIndexes
      this.updateLastIndex()

      // ✅ Só loga quando houver mudança nos visíveis
      /*console.log(
        "[Observer] Slides visíveis (data-index):",

        [...this.visibleDataIndexes].sort((a, b) => a - b),
        "| Último data-index:",
        this.lastIndex
      )*/
    }
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
      const limited = sorted.slice(0, this.store.slidesPerPage)
      const adjustedLast = limited[limited.length - 1]

      this.lastIndex = adjustedLast
      this.setState(this.setActiveDataIndexState())
    }
  }

  private setActiveDataIndexState() {
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
