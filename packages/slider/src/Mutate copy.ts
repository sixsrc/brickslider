import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, removeClass } from "./helpers"
import { Slider } from "./Slider"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public setActiveSlides(slides: HTMLElement[]): void {
    const { infinite, slideIndex, slidesPerPage } = this.store
    let i = 0

    this.forEachSlide(slides, slide => {
      removeClass(slide, CLASS_VALUES.ACTIVE)
    })

    for (i; i < slidesPerPage; i++) {
      let index = slideIndex * slidesPerPage + i

      if (infinite) index += 1

      addClass([slides[index]], CLASS_VALUES.ACTIVE)
    }
  }

  public toggleClass(slideMovement: string) {
    let { slidesPerPage, slidesPerView } = this.store
    let [activeStartIndex, activeEndIndex] = [-1, -1]
    let targetStartIndex: number = 0
    const slides = Slider.getSlides(this.$root)
    const activeIndices: number[] = []
    const isIncrement = slideMovement === "increment"

    if (slidesPerView > slidesPerPage) slidesPerView = slidesPerPage

    this.forEachSlide(slides, (slide, index) => {
      if (slide.classList.contains(CLASS_VALUES.ACTIVE)) {
        if (activeStartIndex === -1) {
          activeStartIndex = index
        }
        activeEndIndex = index
      }
    })

    this.forEachSlide(slides, slide => removeClass(slide, CLASS_VALUES.ACTIVE))

    isIncrement
      ? (targetStartIndex = activeStartIndex + slidesPerView)
      : (targetStartIndex = activeStartIndex - slidesPerView)

    targetStartIndex = Math.max(
      0,
      Math.min(slides.length - slidesPerPage, targetStartIndex)
    )

    for (let i = 0; i < slidesPerPage; i++) {
      const index = targetStartIndex + i
      if (index < slides.length) {
        addClass([slides[index]], CLASS_VALUES.ACTIVE)
        activeIndices.push(index)
      }
    }
  }
}

// const activeSlidesMap = new Map<number, number[]>()
// const activeIndices: number[] = []

//const currentPage = Math.floor(targetStartIndex / slidesPerPage) + 1
// activeSlidesMap.set(currentPage, activeIndices)

//return activeSlidesMap

/*slides.forEach(slide => {
      removeClass(slide, CLASS_VALUES.ACTIVE)
    })*/
