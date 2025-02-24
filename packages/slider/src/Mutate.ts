import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, removeClass } from "./helpers"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public setActiveSlides(slides: HTMLElement[]): void {
    const { infinite, slideIndex, slidesPerPage } = this.store
    let i = 0

    slides.forEach(slide => {
      removeClass(slide, CLASS_VALUES.ACTIVE)
    })

    for (i; i < slidesPerPage; i++) {
      let index = slideIndex * slidesPerPage + i

      if (infinite) index += 1

      addClass([slides[index]], CLASS_VALUES.ACTIVE)
    }
  }
}
