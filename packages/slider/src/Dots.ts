import { BaseSlider } from "./BaseSlider"
import { HandleInfinite } from "./HandleInfinite"
import { Slider } from "./Slider"
import { StateType } from "./State"
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
  calcNumberOfSlides,
  createNewElement,
  getAllElements,
  listener,
  setAttribute
} from "./helpers"

export class Dots extends BaseSlider {
  private slider: Slider
  private containerDots: HTMLElement
  private handleInfinite: HandleInfinite

  constructor($root: string) {
    super($root)
    this.slider = new Slider($root)
    this.containerDots = createNewElement(TAGS.UL)
    this.handleInfinite = new HandleInfinite($root)
  }

  public init(): void {
    setAttribute(
      this.containerDots,
      ATTRIBUTES.CLASS,
      DOM_ELEMENTS.DOTS_SELECTOR.replace(".", "")
    )

    appendToParent(this.getRootSelector, this.containerDots)

    this.setState(this.numberOfSlidesState())
    this.createDots()
    this.eventMount()
  }

  private createDots(): void {
    const { numberOfSlides } = this.store
    const { containerDots } = this

    for (let i = 0; i < numberOfSlides; i++) {
      const liDots = createNewElement(TAGS.LI)

      appendToParent(containerDots, liDots)
      addClass([liDots], CLASS_VALUES.SLIDER_DOT)

      if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
    }
  }

  private dotHandler(): void {
    const { $root, handleInfinite } = this
    const { slideIndex } = this.store
    const touchIndex = slideIndex
    const handleJumpSlide = () => handleInfinite.handleJumpSlide()

    this.slider.updateDots(slideIndex, $root)

    if (handleInfinite.shouldBeTrue()) handleJumpSlide()
    else this.slider.setSlideTarget({ touchIndex, $root })

    this.setState(this.startPosState())
  }

  private eventMount() {
    const dots = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)

    Array.from(dots).forEach((dot, index) => {
      this.handleClick(dot, index)
    })
  }

  private handleClick(dot: HTMLElement, index: number): void {
    listener([EVENTS.CLICK], dot, () => {
      this.setState(this.currentEventType())
      this.setState(this.slideIndexState(index))
      this.dotHandler()
    })
  }

  protected currentEventType(): Partial<StateType> {
    return {
      currentEventType: "dots"
    }
  }

  protected slideIndexState(index: number): Partial<StateType> {
    return { slideIndex: index }
  }

  protected numberOfSlidesState(): Partial<StateType> {
    const { infinite, slidesPerPage } = this.store
    const { $children } = this

    return {
      numberOfSlides: calcNumberOfSlides(infinite, slidesPerPage, $children)
    }
  }

  private startPosState(): Partial<StateType> {
    return {
      startPos: 0
    }
  }
}
