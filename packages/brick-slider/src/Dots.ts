import { BaseSlider } from "./BaseSlider"
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
  setAttribute,
  waitFor
} from "./helpers"
import { TypeTargetSlideParams } from "./types"

export class Dots extends BaseSlider {
  private slider: Slider
  private containerDots: HTMLElement
  private from: TypeTargetSlideParams["from"]

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.containerDots = createNewElement(TAGS.UL)
    this.from = "dots"
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
    const { from, $root } = this
    const { infinite, slideIndex, prevSlideIndex, startPos } = this.store
    const isPrevFirstSlide = infinite && startPos > 0
    const isPrevLastSlide = prevSlideIndex === 5 || prevSlideIndex === 0
    const touchIndex = slideIndex

    this.slider.updateDots(slideIndex, $root)

    isPrevFirstSlide && isPrevLastSlide
      ? this.handleJumpSlide()
      : this.slider.setSlideTarget({ from, touchIndex, $root })

    this.setState(this.startPosState())
  }

  private eventMount() {
    const dots = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)

    Array.from(dots).forEach((dot, index) => {
      this.handleClick(dot, index)
    })
  }

  private handleJumpSlide(): void {
    const { from, $root } = this

    this.setState(this.jumpSlideState(true))

    this.slider.setSlideTarget({ from, $root })

    this.waitForAction()
  }

  private waitForAction() {
    const { from, $root } = this
    const { slideIndex } = this.store

    const action = () => {
      this.setState(this.jumpSlideState(false))
      this.slider.setSlideTarget({ from, touchIndex: slideIndex, $root })
    }
    waitFor(0, action)
  }

  private handleClick(dot: HTMLElement, index: number): void {
    listener([EVENTS.CLICK], dot, () => {
      this.setState(this.slideIndexState(index))
      this.dotHandler()
    })
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

  protected jumpSlideState(condition: boolean) {
    return {
      isJumpSlide: condition
    }
  }

  protected startPosState() {
    return {
      startPos: 0
    }
  }
}
