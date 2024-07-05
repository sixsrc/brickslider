import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { State_Keys } from "./State"
import {
  ATTRIBUTES,
  DOM_ELEMENTS,
  EVENTS,
  STYLES,
  TAGS,
  TRANSITIONS
} from "./constants"
import {
  addClass,
  createNewElement,
  getChildrenCount,
  getElementAttribute,
  getRootSelector,
  listener,
  prependChild,
  setAttribute,
  setIndexBypass,
  setInnerHTML,
  setStyle
} from "./helpers"

export class Arrows extends BaseSlider {
  public $root: string
  private slider: Slider
  private buttons: HTMLElement[] = []
  private getChildrenCount: number

  constructor($root: string) {
    super($root)
    this.$root = $root
    this.getChildrenCount = getChildrenCount(this.$children)
    this.slider = new Slider(this.$root)
  }

  public init(): void {
    const createButtons = this.createButtons(2)
    const buttons = this.appendButtons(createButtons, this.$root)

    buttons.forEach(button => {
      listener([EVENTS.CLICK], button, () => {
        this.state.set({ [State_Keys.StartTime]: Date.now() })

        this.arrowHandler(button, this.$root)()
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

  private arrowHandler(button: Element, $root: string): () => void {
    return () => {
      const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)

      setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

      this.state.set({ [State_Keys.SliderReady]: false })

      this.slider.setSlideTarget({
        from: getAttribute === "prev" ? "prev" : "next",
        $root
      })

      const { slideIndex, slidesPerPage, infinite, dots } = this.store

      const index = infinite
        ? setIndexBypass(slideIndex, this.getChildrenCount, slidesPerPage)
        : slideIndex

      if (dots) this.slider.updateDots(index, $root)
    }
  }
}
