import { BaseSlider } from "./BaseSlider"
import { CLASS_VALUES } from "./constants"
import { addClass, hasClass, removeClass } from "./helpers"
import { Slider } from "./Slider"

export class Mutate extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public updateActiveSlides(slideMovement: string | null = null): void {
    const slides = Slider.getSlides(this.$root)
    const startIndex = this.calculateStartIndex(slides, slideMovement)
    this.resetActiveClasses(slides)

    this.activateSlides(slides, startIndex)
  }

  private calculateStartIndex(
    slides: HTMLElement[],
    slideMovement: string | null
  ): number {
    const { infinite, slideIndex, slidesPerPage } = this.store

    // Localiza o índice do slide com data-index="1"
    const baseIndex = slides.findIndex(slide => slide.dataset.index === "1")

    // console.log("baseIndex", baseIndex)

    if (!slideMovement) {
      // Calcula a posição inicial a partir do baseIndex
      // console.log("asdasd", baseIndex + slideIndex * slidesPerPage)
      return baseIndex //+ slideIndex * slidesPerPage
    }

    return this.setTargetIndex(slides, slideMovement, baseIndex)
  }

  private setTargetIndex(
    slides: HTMLElement[],
    slideMovement: string,
    baseIndex: number
  ): number {
    const { slidesPerPage, slidesPerView, leftOverSlides } = this.store
    const adjustedSlidesPerView = Math.min(slidesPerView, slidesPerPage)
    const isIncrement = slideMovement === "increment"

    // Localiza o índice atual relativo ao baseIndex
    let currentIdx = slides.findIndex(slide =>
      hasClass(slide, CLASS_VALUES.ACTIVE)
    )

    if (!isIncrement && leftOverSlides > 0) {
      currentIdx = currentIdx + (slidesPerPage - leftOverSlides)

      this.setState({
        leftOverSlides: 0
      })
    }

    console.log("teste", baseIndex, currentIdx)

    const relativeIdx = currentIdx - baseIndex

    // Calcula o novo índice alvo relativo ao baseIndex
    let targetIdx =
      relativeIdx +
      (isIncrement ? adjustedSlidesPerView : -adjustedSlidesPerView)

    console.log("targetIdx", targetIdx)

    // Garante que o índice fique dentro dos limites
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
      if (index < slides.length) addClass([slides[index]], CLASS_VALUES.ACTIVE)
    })
  }
}
