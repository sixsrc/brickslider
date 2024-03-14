import { addClass } from "@/dom/addClass"
import { removeClass } from "@/dom/removeClass"
import { CLASS_VALUES } from "@/util/constants"

export function updateActiveSlide(
  slides: HTMLElement[],
  slideIndex: number,
  slidesPerPage: number
): void {
  let i = 0

  slides.forEach(slide => {
    removeClass(slide, CLASS_VALUES.ACTIVE)
  })

  for (i; i < slidesPerPage; i++) {
    const index = slideIndex * slidesPerPage + i
    addClass([slides[index]], CLASS_VALUES.ACTIVE)
  }
}
