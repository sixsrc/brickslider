import { BaseSlider } from "./BaseSlider"
import { getSliderNodeList, waitFor } from "./helpers"

export class Center extends BaseSlider {
  slides: HTMLElement[]
  gap: number

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList($root)
    this.gap = 20
  }

  public init(currentIndex: number): void {
    const containerWidth = this.$children.clientWidth
    console.log(containerWidth)
    const slidesWidths = this.slides.map(slide => slide.clientWidth)
    const isFullWidthSlide = slidesWidths[currentIndex] >= containerWidth

    if (isFullWidthSlide) {
      this.setFullWidthTranslate(currentIndex, slidesWidths)
    } else {
      this.setCenteredTranslate(currentIndex, containerWidth, slidesWidths)
    }

    this.animate(this.$children, this.keyFrames(), this.options(0))
    // console.log("visible slides", this.getVisibleSlides())
  }

  private setFullWidthTranslate(
    currentIndex: number,
    slidesWidths: number[]
  ): void {
    let translate = 0
    for (let i = 0; i < currentIndex; i++) {
      translate -= slidesWidths[i] + this.gap
    }
    this.setState({
      currentTranslate: translate,
      prevTranslate: translate
    })
  }

  private setCenteredTranslate(
    currentIndex: number,
    containerWidth: number,
    slidesWidths: number[]
  ): void {
    let leftPosition = 0
    let visibleWidth = 0
    let visibleSlidesCount = 0
    let partialSlideWidth = 0

    for (let i = 0; i < this.slides.length; i++) {
      if (i < currentIndex) {
        leftPosition += slidesWidths[i] + this.gap
      } else {
        const slideWidth =
          slidesWidths[i] + (i < this.slides.length - 1 ? this.gap : 0)
        if (visibleWidth + slideWidth <= containerWidth) {
          visibleWidth += slideWidth
          visibleSlidesCount++
        } else {
          partialSlideWidth = containerWidth - visibleWidth
          break
        }
      }
    }

    const visibleSlides = this.getVisibleSlides()
    const effectiveVisibleSlides =
      visibleSlidesCount +
      (partialSlideWidth > 0
        ? partialSlideWidth / slidesWidths[currentIndex + visibleSlidesCount]
        : 0)

    const adjustment = (containerWidth - visibleWidth) / 3

    console.log("eeee", effectiveVisibleSlides)
    const translate = -(leftPosition - adjustment)

    console.log("translate", translate)

    this.setState({
      currentTranslate: translate,
      prevTranslate: translate
    })
  }

  private getVisibleSlides(): number {
    const slides = getSliderNodeList(this.$root)
    const containerRect = this.$children.getBoundingClientRect()
    let visibleSlidesCount = 0

    slides.forEach(slide => {
      const slideRect = slide.getBoundingClientRect()
      const isVisible =
        slideRect.left < containerRect.right &&
        slideRect.right > containerRect.left
      console.log(slide, isVisible)
      if (isVisible) {
        visibleSlidesCount++
      }
    })

    return visibleSlidesCount
  }

  public handleResize(): void {
    const activeSlideIndex = this.slides.findIndex(slide =>
      slide.classList.contains("active")
    )
    this.init(activeSlideIndex !== -1 ? activeSlideIndex : 0)
  }
}
