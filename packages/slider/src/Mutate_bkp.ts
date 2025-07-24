import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, removeClass } from "./helpers"
import { Slider } from "./Slider"

export class Mutate extends BaseSlider {
  private activeIndex: number

  constructor($root: string) {
    super($root)
    this.activeIndex = 0
  }

  public updateActiveSlides(slideMov: string | null = null): void {
    this.startUpdate(slideMov)
    this.resetActiveClasses(this.getSlides())
    this.activateSlides(this.getSlides(), this.activeIndex)
  }

  private getSlides(): HTMLElement[] {
    const slides = Slider.getSlides(this.$root, false)
    return slides
  }

  private startUpdate(slideMov: string | null = null): void {
    const startIndex = this.calculateStartIndex(this.getSlides(), slideMov)
    this.activeIndex = startIndex
  }

  private calculateStartIndex(
    slides: HTMLElement[],
    slideMovement: string | null
  ): number {
    let baseIndex = slides.findIndex(slide => slide.dataset.index === "1")

    if (!slideMovement) return baseIndex

    return this.setTargetIndex(slides, slideMovement, baseIndex)
  }

  private setTargetIndex(
    slides: HTMLElement[],
    slideMovement: string,
    baseIndex: number
  ): number {
    const {
      activePage,
      slidesPerPage,
      slidesPerView,
      leftOverSlides,
      infinite
    } = this.store
    const adjustedSlidesPerView = Math.min(slidesPerView, slidesPerPage)
    const isIncrement = slideMovement === "increment"
    let result = 0
    const index = slides.findIndex(slide => slide.dataset.index === "1")
    const { leftOver } = this.getMissingSlides()

    if (!isIncrement) {
      if (leftOverSlides > 0) {
        this.activeIndex = this.activeIndex + leftOver //+3
        this.setState({ leftOverSlides: 0 })
      }
      if (activePage === 0) baseIndex = index
      else baseIndex = 0
    }

    const relativeIdx = this.activeIndex - baseIndex

    let targetIdx =
      relativeIdx +
      (isIncrement ? adjustedSlidesPerView : -adjustedSlidesPerView)

    if (isIncrement && !infinite && leftOverSlides > 0) {
      targetIdx = targetIdx - 1
    }

    result = Math.max(
      infinite ? baseIndex + slidesPerPage : baseIndex,
      Math.min(slides.length - slidesPerPage, baseIndex + targetIdx)
    )

    return result

    /* if (!isIncrement && infinite) {
      baseIndex = 0
    } else if (!isIncrement && infinite && activePage === 0) {
      baseIndex = index
    }*/
  }

  private resetActiveClasses(slides: HTMLElement[]): void {
    slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))
  }
  private activateSlides(slides: HTMLElement[], startIndex: number): void {
    const { slidesPerPage } = this.store
    let index = 0

    Array.from({ length: slidesPerPage }).forEach((_, i) => {
      index = startIndex + i

      if (index < slides.length) addClass([slides[index]], CLASS_VALUES.ACTIVE)
    })
  }
}

//if (!isIncrement && leftOverSlides > 0) {
//  /* this.activeIndex = this.activeIndex + leftOver //+3
// this.setState({ leftOverSlides: 0 })*/
// }

/*
  if (!isIncrement && !infinite && leftOverSlides > 0) {
      //targetIdx = targetIdx + 2
    }

*/
/*
 if (isIncrement && leftOverSlides > 0) {
      //this.activeIndex = 8
      //currentIdx = currentIdx - (slidesPerPage - leftOverSlides)
    }

      if (infinite && mov === "decrement" && activePage === 0) {
      index = slides.findIndex(slide => slide.dataset.index === "1")

      //return index + slidesPerPage
      /*return Math.max(
        baseIndex
        Math.min(slides.length - slidesPerPage, baseIndex + targetIdx) +
          slidesPerView +
          1
      )
    }
    
      if (!isIncrement && leftOverSlides > 0) {
      //targetIdx = targetIdx + 1
      //this.setState({ leftOverSlides: 0 })
    }
    
    */
