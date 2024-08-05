import { BaseSlider } from "./BaseSlider"
import { HandleInfinite } from "./HandleInfinite"
import { Slider } from "./Slider"
import { ATTRIBUTES, DOM_ELEMENTS, EVENTS, TAGS } from "./constants"
import {
  addClass,
  createNewElement,
  getElementAttribute,
  getRootSelector,
  listener,
  prependChild,
  removeAttribute,
  reorderIndex,
  setAttribute,
  setInnerHTML
} from "./helpers"

export class Arrows extends BaseSlider {
  public $root: string
  private slider: Slider
  private buttons: HTMLElement[] = []
  private handleInfinite: HandleInfinite

  constructor($root: string) {
    super($root)
    this.$root = $root
    this.slider = new Slider(this.$root)
    this.handleInfinite = new HandleInfinite($root)
  }

  public init(): void {
    const createButtons = this.createButtons(2)
    const buttons = this.appendButtons(createButtons, this.$root)

    buttons.forEach(button => {
      listener([EVENTS.CLICK], button, () => {
        this.arrowHandler(button, this.$root)
      })
    })
  }

  private createButtons(numberOfButtons: number): HTMLElement[] {
    for (let i = 0; i < numberOfButtons; i++) {
      const button = createNewElement(TAGS.BUTTON)
      const isGreaterThanZero = i === 0

      setAttribute(
        button,
        ATTRIBUTES.DIRECTION,
        isGreaterThanZero ? "next" : "prev"
      )

      addClass([button], DOM_ELEMENTS.BRICK_ARROWS)

      setInnerHTML(button, isGreaterThanZero ? "next" : "prev")
      this.buttons.push(button)
      //removeAttribute(button, ATTRIBUTES.DIRECTION)
    }

    return this.buttons
  }

  private appendButtons(
    buttons: HTMLElement[],
    selector: string
  ): HTMLElement[] {
    const $root = getRootSelector(selector)

    buttons.forEach(button => {
      prependChild($root, button)
    })

    return buttons
  }

  private arrowHandler(button: Element, $root: string): void {
    const { infinite, slideIndex: prevSlideIndex } = this.store
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const currentEventType = getAttribute === "prev" ? "prev" : "next"
    const shouldBeTrue = this.handleInfinite.shouldBeTrue()
    const handleJumpSlide = () => this.handleInfinite.handleJumpSlide()
    const isPrev = prevSlideIndex === 0 || prevSlideIndex === 5
    const isPrevSlide = infinite && isPrev && !shouldBeTrue
    const isTargetSlide = shouldBeTrue || isPrevSlide

    this.setState({ prevSlideIndex, currentEventType })

    if (isTargetSlide) handleJumpSlide()
    else this.slider.setSlideTarget({ $root })

    let { index } = this.getIndex()

    if (shouldBeTrue) index = index - 1
    else if (isPrevSlide) index = index + 1

    this.slider.updateDots(index, $root)
  }

  private getIndex() {
    const { infinite, slideIndex, slidesPerPage } = this.store
    const countSlides = this.childrenCount
    const index = infinite
      ? reorderIndex(slideIndex, countSlides, slidesPerPage)
      : slideIndex

    return { index }
  }
}
