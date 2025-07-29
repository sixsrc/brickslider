import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, removeClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  /* public updateActiveSlides(visibleIndexes: number[] | null): void {
    this.resetActiveClasses()
    this.activateVisibleSlides(visibleIndexes as number[])
  }*/

  public updateActiveSlides(
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
