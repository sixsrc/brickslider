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
  calcTranslate,
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
  private realIndex: number | null

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.containerDots = createNewElement(TAGS.UL)
    this.realIndex = null
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
    const { slideIndex } = this.store
    const touchIndex = slideIndex

    this.slider.updateDots(slideIndex, $root)

    if (this.shouldBeTrue()) this.handleJumpSlide()
    else this.slider.setSlideTarget({ from, touchIndex, $root })

    this.setState(this.startPosState())
  }

  private shouldBeTrue() {
    const { infinite, prevSlideIndex, startPos } = this.store
    const isStartPos = infinite && startPos > 0
    const isPrevSlide = prevSlideIndex === 4 || prevSlideIndex === 1

    return isStartPos && isPrevSlide
  }

  private eventMount() {
    const dots = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)

    Array.from(dots).forEach((dot, index) => {
      this.handleClick(dot, index)
    })
  }

  private handleJumpSlide(): void {
    const { slideIndex } = this.store

    this.realIndex = slideIndex
    this.setState(this.slideState())
    this.animate(this.keyFrames(), this.options(0))
    this.waitForAction()
  }

  private waitForAction() {
    const { from, $root } = this
    const touchIndex = this.realIndex as number
    const props = {
      from,
      touchIndex,
      $root
    }

    const action = () => {
      this.setState(this.jumpSlideState(false))
      this.slider.setSlideTarget(props)
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

  private setTranslate(): Record<any, number> {
    const { $children } = this
    const { infinite, slidesPerPage } = this.store
    const numOfSlides = calcNumberOfSlides(infinite, slidesPerPage, $children)
    const [FIRST, LAST] = [numOfSlides, numOfSlides - numOfSlides + 1]

    return {
      FIRST,
      LAST
    }
  }

  private slideState(): Partial<StateType> {
    const { prevSlideIndex, spacing } = this.store
    const { $children } = this
    const isFirst = prevSlideIndex === this.setTranslate().FIRST
    let index = null

    isFirst
      ? (index = this.setTranslate().LAST)
      : (index = this.setTranslate().FIRST)

    const translate = calcTranslate($children, spacing, index)

    return {
      isJumpSlide: true,
      currentTranslate: translate,
      prevTranslate: translate
    }
  }

  private jumpSlideState(condition: boolean): Partial<StateType> {
    return {
      isJumpSlide: condition
    }
  }

  private startPosState(): Partial<StateType> {
    return {
      startPos: 0
    }
  }
}
