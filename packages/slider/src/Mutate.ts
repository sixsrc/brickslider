import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, hasClass, removeClass } from "./helpers"
import { Slider } from "./Slider"

export class Mutate extends BaseSlider {
  activeIndex: number

  constructor($root: string) {
    super($root)
    this.activeIndex = 0
  }

  public updateActiveSlides(slideMovement: string | null = null): void {
    //atenção aqui infinite com false.
    const slides = Slider.getSlides(this.$root, false)
    const startIndex = this.calculateStartIndex(slides, slideMovement)

    this.activeIndex = startIndex // Atualiza o índice ativo

    this.resetActiveClasses(slides)
    this.activateSlides(slides, this.activeIndex)
  }

  private calculateStartIndex(
    slides: HTMLElement[],
    slideMovement: string | null
  ): number {
    const baseIndex = slides.findIndex(slide => slide.dataset.index === "1")

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
      infinite,

      currentSlideMovement: mov
    } = this.store
    const adjustedSlidesPerView = Math.min(slidesPerView, slidesPerPage)
    const isIncrement = slideMovement === "increment"

    /*let currentIdx = slides.findIndex(slide =>
      hasClass(slide, CLASS_VALUES.ACTIVE)
    )*/
    //let currentIdx = this.activeIndex

    // console.log("slideMOvement", isIncrement, leftOverSlides)

    if (isIncrement && leftOverSlides > 0) {
      //this.activeIndex = 8
      //currentIdx = currentIdx - (slidesPerPage - leftOverSlides)
    }
    if (!isIncrement && leftOverSlides > 0) {
      //this.activeIndex = this.activeIndex + (slidesPerPage - 0)
      this.activeIndex = this.activeIndex + 1
      console.log("roy khan", leftOverSlides)
      this.setState({ leftOverSlides: 0 })
      // currentIdx = currentIdx + (slidesPerPage - leftOverSlides)
      //this.setState({ leftOverSlides: 0 })
    }

    //const relativeIdx = currentIdx - baseIndex
    const relativeIdx = this.activeIndex - baseIndex

    let targetIdx =
      relativeIdx +
      (isIncrement ? adjustedSlidesPerView : -adjustedSlidesPerView)

    if (isIncrement && !infinite && leftOverSlides > 0) {
      targetIdx = targetIdx - 1
    }
    if (!isIncrement && leftOverSlides > 0) {
      //targetIdx = targetIdx + 1
      //this.setState({ leftOverSlides: 0 })
    }

    if (infinite && mov === "decrement" && activePage === 0) {
      return Math.max(
        baseIndex,
        Math.min(slides.length - slidesPerPage, baseIndex + targetIdx) +
          slidesPerView +
          1
      )
    }

    console.log("targetIdx", targetIdx)

    return Math.max(
      baseIndex,
      Math.min(slides.length - slidesPerPage, baseIndex + targetIdx)
    )
  }

  private resetActiveClasses(slides: HTMLElement[]): void {
    slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))
  }

  private activateSlides(slides: HTMLElement[], startIndex: number): void {
    const { slidesPerPage } = this.store

    Array.from({ length: slidesPerPage }).forEach((_, i) => {
      const index = startIndex + i

      if (index < slides.length) {
        addClass([slides[index]], CLASS_VALUES.ACTIVE)
      }
    })
  }
}
