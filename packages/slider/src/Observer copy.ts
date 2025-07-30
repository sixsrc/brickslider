import { BaseSlider } from "./BaseSlider"

export class Observer extends BaseSlider {
  private observer: IntersectionObserver
  private visibleIndexes = new Set<number>()

  constructor($root: string) {
    super($root)

    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      root: this.$track,
      threshold: 0.9
    })

    this.observeSlides()
  }

  private observeSlides(): void {
    this.slidesArr.forEach((slide, index) => {
      // slide.dataset.index = index.toString()
      this.observer.observe(slide)
    })
  }

  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    let updated = false

    entries.forEach((entry, idx) => {
      const index = parseInt(
        (entry.target as HTMLElement).dataset.index || "-1"
      )

      if (isNaN(index)) return

      if (entry.isIntersecting) {
        if (!this.visibleIndexes.has(index)) {
          this.visibleIndexes.add(index)
          updated = true
        }
      } else {
        if (this.visibleIndexes.delete(index)) {
          updated = true
        }
      }
    })

    if (updated) {
      /*console.log(
        "[Observer] Slides visíveis atualizados:",
        [...this.visibleIndexes].sort((a, b) => a - b)
      )*/
    }
  }

  // Método público para chamar manualmente e ver os índices visíveis
  public logVisibleSlides(): void {
    /*console.log(
      "[Observer] Slides visíveis agora (chamado manualmente):",
      [...this.visibleIndexes].sort((a, b) => a - b)
    )*/
  }

  public getVisibleSlideIndexes(): number[] {
    return [...this.visibleIndexes].sort((a, b) => a - b)
  }
}
