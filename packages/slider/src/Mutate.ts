import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./helpers"
import { addClass, removeClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  private getAllSlides(): HTMLElement[] {
    return Array.from(this.$children?.children || []) as HTMLElement[]
  }

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

    const allSlides = this.getAllSlides()

    allSlides.forEach((slide, index) => {
      if (toActivate.includes(index)) {
        addClass([slide], CLASS_VALUES.ACTIVE)
      } else {
        removeClass(slide, CLASS_VALUES.ACTIVE)
      }
    })
  }

  private resetActiveClasses(): void {
    this.slidesArr.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))
  }
}
