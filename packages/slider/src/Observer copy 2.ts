import { BaseSlider } from "./BaseSlider"

export class Observer extends BaseSlider {
  private observer: IntersectionObserver
  private visibleIndexes = new Set<number>()
  private elementToIndexMap = new Map<HTMLElement, number>()
  private visibleDataIndexes = new Set<number>() // Novo: para armazenar data-indexes

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
        this.elementToIndexMap.set(slide, index)
      }

      this.observer.observe(slide)
    })
  }

  private handleIntersect(entries: IntersectionObserverEntry[]): void {
    let updated = false
    const { isInfinite } = this.store

    entries.forEach(entry => {
      let index: number
      const dataIndex = parseInt(
        (entry.target as HTMLElement).dataset.index || "-1"
      )

      if (isNaN(dataIndex) || dataIndex === -1) return

      if (isInfinite) {
        // Modo infinito: usa índice real do array para visibleIndexes
        const mappedIndex = this.elementToIndexMap.get(
          entry.target as HTMLElement
        )
        if (mappedIndex === undefined) return
        index = mappedIndex
      } else {
        // Modo normal: usa data-index para visibleIndexes também
        index = dataIndex
      }

      if (entry.isIntersecting) {
        if (!this.visibleIndexes.has(index)) {
          this.visibleIndexes.add(index)
          this.visibleDataIndexes.add(dataIndex) // Sempre adiciona o data-index
          updated = true
        }
      } else {
        if (this.visibleIndexes.delete(index)) {
          this.visibleDataIndexes.delete(dataIndex) // Sempre remove o data-index
          updated = true
        }
      }
    })

    if (updated) {
      // Atualiza o lastIndex SEMPRE com o maior data-index visível
      this.updateLastIndex()

      console.log(
        "[Observer] Slides visíveis (índices reais):",
        [...this.visibleIndexes].sort((a, b) => a - b),
        "| Data-indexes visíveis:",
        [...this.visibleDataIndexes].sort((a, b) => a - b),
        "| Último data-index:",
        this.lastIndex
      )
    }
  }

  private updateLastIndex(): void {
    if (this.visibleDataIndexes.size > 0) {
      // SEMPRE pega o maior data-index dos slides visíveis
      this.lastIndex = Math.max(...this.visibleDataIndexes)
      this.setState({
        startTime: this.lastIndex
      })
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
}
