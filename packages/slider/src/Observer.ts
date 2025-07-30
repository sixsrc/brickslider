import { BaseSlider } from "./BaseSlider"

export class Observer extends BaseSlider {
  private observer: IntersectionObserver
  private visibleIndexes = new Set<number>()
  private elementToIndexMap = new Map<HTMLElement, number>() // Para modo infinito

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
      const { isInfinite } = this.store

      if (isInfinite) {
        // Modo infinito: mapeia elemento para índice real
        this.elementToIndexMap.set(slide, index)
      } else {
        // Modo normal: usa data-index
        slide.dataset.index = index.toString()
      }

      this.observer.observe(slide)
    })
  }

  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    let updated = false
    const { isInfinite } = this.store

    entries.forEach(entry => {
      let index: number

      if (isInfinite) {
        // Modo infinito: busca índice pelo mapa
        const mappedIndex = this.elementToIndexMap.get(
          entry.target as HTMLElement
        )
        if (mappedIndex === undefined) return
        index = mappedIndex
      } else {
        // Modo normal: busca índice pelo data-index
        const dataIndex = parseInt(
          (entry.target as HTMLElement).dataset.index || "-1"
        )
        if (isNaN(dataIndex) || dataIndex === -1) return
        index = dataIndex
      }

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
      console.log(
        "[Observer] Slides visíveis atualizados:",
        [...this.visibleIndexes].sort((a, b) => a - b)
      )
    }
  }

  public getVisibleSlideIndexes(): number[] {
    return [...this.visibleIndexes].sort((a, b) => a - b)
  }
}
