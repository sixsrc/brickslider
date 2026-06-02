import { BaseSlider } from "./BaseSlider"
import { calcNumberOfSlides, calcTranslate, waitFor } from "./helpers"
import { Slider } from "./Slider-ORIGINAL"
import { StateType } from "./State"

export class Sync extends BaseSlider {
  private slider: Slider
  private indeedIndex: number

  constructor($root: string) {
    super($root)

    this.slider = new Slider($root)
    this.indeedIndex = 0
  }

  public now() {
    return this.isStartPos() && this.isTarget()
  }

  private isStartPos() {
    const { infinite, startPos } = this.store

    return infinite && startPos > 0
  }

  private isTarget() {
    const numOfSlides = this.calcNumOfSlides()
    const { prevSlideIndex: prevIdx } = this.store
    const inc = this.isIncrementOrDecrement() === "increment"
    const dec = this.isIncrementOrDecrement() === "decrement"

    return (inc && prevIdx === numOfSlides) || (dec && prevIdx === 1)
  }

  private isIncrementOrDecrement() {
    const { currentSlideMovement: movement } = this.store

    return movement === "increment" ? "increment" : "decrement"
  }

  private calcNumOfSlides() {
    const { infinite, slidesPerPage } = this.store

    return calcNumberOfSlides(infinite, slidesPerPage, this.$children)
  }

  public moveTo(): Record<any, number> {
    const [FIRST, LAST] = [this.calcNumOfSlides(), 1]

    return {
      FIRST,
      LAST
    }
  }

  private slideState(): Partial<StateType> {
    const { prevSlideIndex: prev, spacing } = this.store
    const { $children } = this
    const isSameIdx = prev === this.moveTo().FIRST
    let index = 0

    isSameIdx ? (index = this.moveTo().LAST) : (index = this.moveTo().FIRST)

    const translate = calcTranslate($children, spacing, index)

    return {
      slideIndex: index,
      isJumpSlide: true,
      currentTranslate: translate,
      prevTranslate: translate
    }
  }

  public handleJumpSlide(): void {
    const { slideIndex } = this.store

    this.indeedIndex = slideIndex

    this.setState(this.slideState())
    this.animate(this.$children, this.keyFrames(), this.options(0))
    this.waitForAction()
  }

  private jumpSlideState(condition: boolean): Partial<StateType> {
    return {
      isJumpSlide: condition
    }
  }

  private waitForAction(): void {
    const { $root } = this
    const from = this.store.currentEventType
    const touchIndex = this.indeedIndex as number
    const props = { from, touchIndex, $root }

    const action = () => {
      this.setState(this.jumpSlideState(false))
      this.slider.setSlideTarget(props)
    }

    waitFor(0, action)
  }
}
