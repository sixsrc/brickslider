import { BaseSlider } from "./BaseSlider"
import { HandleInfinite } from "./HandleInfinite"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { ATTRIBUTES, DOM_ELEMENTS, EVENTS, TAGS } from "./constants"
import {
  addClass,
  createNewElement,
  getElementAttribute,
  getRootSelector,
  listener,
  prependChild,
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
    const { handleInfinite } = this
    const { infinite, dots, slideIndex: prevSlideIndex } = this.store
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const currentEventType = getAttribute === "prev" ? "prev" : "next"
    const shouldBeTrue = handleInfinite.shouldBeTrue()
    const isPrevSlide =
      (infinite && prevSlideIndex === 0) || (infinite && prevSlideIndex === 5)
    const handleJumpSlide = () => handleInfinite.handleJumpSlide()

    console.log("prevSlideIndex", prevSlideIndex)
    this.setState({ prevSlideIndex, currentEventType })

    if (shouldBeTrue || (isPrevSlide && !shouldBeTrue)) handleJumpSlide()
    else this.slider.setSlideTarget({ $root })

    this.setState(this.startPosState())

    const { index } = this.getIndex()

    if (dots) this.slider.updateDots(index, $root)
  }

  private getIndex() {
    const { slideIndex, infinite, slidesPerPage } = this.store
    const countSlides = this.childrenCount
    const index = infinite
      ? reorderIndex(slideIndex, countSlides, slidesPerPage)
      : slideIndex

    return { index }
  }

  private startPosState(): Partial<StateType> {
    return {
      startPos: Infinity
    }
  }
}
//this.setState({ isJumpSlide: true })
