import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { State_Keys } from "./State"
import {
  ATTRIBUTES,
  CLASS_VALUES,
  DOM_ELEMENTS,
  EVENTS,
  TAGS
} from "./constants"
import {
  addClass,
  appendToParent,
  createNewElement,
  getAllElements,
  getChildrenCount,
  getRootSelector,
  listener,
  setAttribute
} from "./helpers"

export class Dots extends BaseSlider {
  private slider: Slider
  private containerDots: HTMLElement

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.containerDots = createNewElement(TAGS.UL)
  }

  public init(): void {
    const $root = getRootSelector(this.$root)

    setAttribute(
      this.containerDots,
      ATTRIBUTES.CLASS,
      DOM_ELEMENTS.DOTS_SELECTOR.replace(".", "")
    )

    appendToParent($root, this.containerDots)

    this.setSliderCount()

    this.createDots()

    const dots = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)

    Array.from(dots).forEach((dot, index) => {
      this.handleClick(dot, index)
    })
  }

  private createDots(): void {
    const numberOfSlides = this.store[State_Keys.NumberOfSlides]

    for (let i = 0; i < numberOfSlides; i++) {
      const liDots = createNewElement(TAGS.LI)

      appendToParent(this.containerDots, liDots)

      addClass([liDots], CLASS_VALUES.SLIDER_DOT)

      if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
    }
  }

  private setSliderCount(): void {
    this.state.set({
      [State_Keys.NumberOfSlides]: this.calculateNumberOfSlides()
    })
  }

  private calculateNumberOfSlides() {
    const { slidesPerPage, infinite } = this.store
    const sliderCount = getChildrenCount(this.$children)

    if (infinite && slidesPerPage <= 1) {
      return sliderCount - 2
    }
    if (infinite && slidesPerPage > 1) {
      return Math.ceil(sliderCount / slidesPerPage) - slidesPerPage
    }
    if (!infinite && slidesPerPage > 1) {
      return Math.ceil(sliderCount / slidesPerPage)
    }
    return sliderCount
  }

  private dotHandler($root: string): void {
    let { slideIndex } = this.store
    const from = "dots"

    this.slider.updateDots(slideIndex, $root)

    this.slider.setSlideTarget({
      from,
      // touchIndex: infinite ? ++slideIndex : slideIndex,
      touchIndex: slideIndex,
      $root
    })
  }

  private handleClick(dot: HTMLElement, index: number): void {
    listener([EVENTS.CLICK], dot, () => {
      this.state.set({ slideIndex: index })

      this.dotHandler(this.$root)
    })
  }
}
