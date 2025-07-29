import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"

export class Observer extends BaseSlider {
  private mutate: Mutate
  private observer: IntersectionObserver
  private visibleIndexes = new Set<number>()

  constructor($root: string) {
    super($root)
    this.mutate = new Mutate($root)

    this.observer = new IntersectionObserver(this.handleIntersect.bind(this), {
      root: this.$track, // já vem de BaseSlider
      threshold: 0.9
    })

    this.observeSlides()
  }

  private observeSlides(): void {
    this.slidesArr.forEach((slide, index) => {
      slide.dataset.index = index.toString()
      this.observer.observe(slide)
    })
  }

  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    let updated = false

    entries.forEach(entry => {
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
      // Código original comentado para entendimento:
      // this.mutate.updateActiveSlides([...this.visibleIndexes].sort((a, b) => a - b))

      console.log(
        "[Observer] Slides visíveis atualizados:",
        [...this.visibleIndexes].sort((a, b) => a - b)
      )
    }
  }

  // Método público para chamar manualmente e ver os índices visíveis
  public logVisibleSlides(): void {
    console.log(
      "[Observer] Slides visíveis agora (chamado manualmente):",
      [...this.visibleIndexes].sort((a, b) => a - b)
    )
  }

  public getVisibleSlideIndexes(): number[] {
    return [...this.visibleIndexes].sort((a, b) => a - b)
  }
}
