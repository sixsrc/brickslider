import { Slider } from "./Slider"
import { State, StateType, State_Keys } from "./State"
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
  getChildren,
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

export class Arrows {
  public $root: string
  private $children: HTMLElement
  private state: State
  private store: StateType
  private slider: Slider
  private buttons: HTMLElement[] = []
  private getChildrenCount: number

  constructor($root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.getChildrenCount = getChildrenCount(this.$children)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
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

      this.handleMouseLeave()

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

      this.handleTransitionEnd(index)
    }
  }

  private handleMouseLeave(): void {
    listener([EVENTS.MOUSELEAVE], this.$children, () => {
      setStyle(this.$children, STYLES.TRANSITION, "")
    })
  }

  private handleTransitionEnd(index: number): void {
    listener([EVENTS.TRANSITIONEND], this.$children, () => {
      this.state.set({ [State_Keys.EndTime]: Date.now() })

      const { infinite, numberOfSlides, startTime, endTime } = this.store
      const isDefaultClick = Math.abs(startTime - endTime) >= 300

      if (
        isDefaultClick ||
        (!infinite && index > numberOfSlides - 1) ||
        (!infinite && numberOfSlides < 0)
      )
        setStyle(this.$children, STYLES.TRANSITION, "")
    })
  }
}
