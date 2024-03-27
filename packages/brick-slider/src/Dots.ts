import { Slider } from "./Slider"
import { State, StateType, State_Keys } from "./State"
import {
  ATTRIBUTES,
  CLASS_VALUES,
  DOM_ELEMENTS,
  EVENTS,
  STYLES,
  TAGS,
  TRANSITIONS
} from "./constants"
import {
  addClass,
  appendToParent,
  createNewElement,
  getAllElements,
  getChildren,
  getChildrenCount,
  getRootSelector,
  listener,
  setAttribute,
  setStyle
} from "./helpers"

export class Dots {
  public $root: string
  private $children: HTMLElement
  private state: State
  private store: StateType
  private slider: Slider
  private containerDots: HTMLElement

  constructor($root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
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
    const { slidesPerPage, infinite } = this.store

    const sliderCount = getChildrenCount(this.$children)

    if (infinite && slidesPerPage <= 1) {
      this.state.set({ [State_Keys.NumberOfSlides]: sliderCount - 2 })
    } else if (infinite && slidesPerPage > 1) {
      this.state.set({
        [State_Keys.NumberOfSlides]:
          Math.ceil(sliderCount / slidesPerPage) - slidesPerPage
      })
    } else if (!infinite && slidesPerPage > 1) {
      this.state.set({
        [State_Keys.NumberOfSlides]: Math.ceil(sliderCount / slidesPerPage)
      })
    }
  }

  private dotHandler($root: string): void {
    let index = this.store[State_Keys.SlideIndex]

    this.slider.updateDots(index, $root)

    setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    const from = "dots"

    const isInfinite = this.store[State_Keys.Infinite]

    this.slider.setSlideTarget({
      from,
      touchIndex: isInfinite ? ++index : index,
      $root
    })
  }

  private handleClick(dot: HTMLElement, index: number): void {
    listener([EVENTS.CLICK], dot, () => {
      this.state.set({ [State_Keys.SlideIndex]: index })

      this.dotHandler(this.$root)
    })
  }
}

/*if (infinite && slidesPerPage <= 1)
      this.state.set(State_Keys.NumberOfSlides, sliderCount - 2)
  
    if (infinite && slidesPerPage > 1)
      this.state.set(
        State_Keys.NumberOfSlides,
        Math.ceil(sliderCount / slidesPerPage) - slidesPerPage
      )
  
    if (!infinite && slidesPerPage > 1) {
      this.state.set(State_Keys.NumberOfSlides, Math.ceil(sliderCount / slidesPerPage))
    }*/
