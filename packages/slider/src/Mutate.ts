import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, removeClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  private getAllSlides(): HTMLElement[] {
    return Array.from(this.$children?.children || []) as HTMLElement[]
  }
  /* public updateActiveSlides(visibleIndexes: number[] | null): void {
    this.resetActiveClasses()
    this.activateVisibleSlides(visibleIndexes as number[])
  }*/

  /*public updateActiveSlides(
    visibleIndexes: number[] | null,
    maxActive?: number
  ): void {
    this.resetActiveClasses()

    if (!visibleIndexes) return

    const toActivate =
      maxActive !== undefined
        ? visibleIndexes.slice(0, maxActive)
        : visibleIndexes

    this.activateVisibleSlides(toActivate)
  }*/

  /*public updateActiveSlides(visibleIndexes: number[]): void {
    const { slidesPerPage } = this.store
    this.resetActiveClasses()

    // Adiciona active apenas nos que estão visíveis
    visibleIndexes.slice(0, slidesPerPage).forEach(index => {
      const slide = this.slidesArr[index]
      if (slide) addClass([slide], CLASS_VALUES.ACTIVE)
    })
  }*/

  public updateActiveSlides(
    visibleIndexes: number[] | null,
    maxActive?: number
  ): void {
    //this.resetActiveClasses()

    if (!visibleIndexes) return

    // Limita o número de slides a ativar pelo maxActive, se definido
    const toActivate =
      maxActive !== undefined
        ? visibleIndexes.slice(0, maxActive)
        : visibleIndexes

    const allSlides = this.getAllSlides()

    allSlides.forEach(slide => {
      const slideIndex = Number(slide.dataset.index)
      if (toActivate.includes(slideIndex)) {
        addClass([slide], CLASS_VALUES.ACTIVE)
      } else {
        removeClass(slide, CLASS_VALUES.ACTIVE)
      }
    })
  }

  private resetActiveClasses(): void {
    this.slidesArr.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))
  }

  private activateVisibleSlides(visibleIndexes: number[]): void {
    visibleIndexes.forEach(index => {
      const slide = this.slidesArr[index]
      if (slide) addClass([slide], CLASS_VALUES.ACTIVE)
    })
  }
}
