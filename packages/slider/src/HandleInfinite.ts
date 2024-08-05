import { BaseSlider } from "./BaseSlider"
import { calcNumberOfSlides, calcTranslate, waitFor } from "./helpers"
import { Slider } from "./Slider"
import { StateType } from "./State"

export class HandleInfinite extends BaseSlider {
  private indeedIndex: number | null
  private slider: any

  constructor($root: string) {
    super($root)
    this.slider = new Slider($root)
    this.indeedIndex = null
  }

  public shouldBeTrue() {
    const {
      infinite,
      prevSlideIndex,
      currentEventType,
      startPos,
      slidesPerPage
    } = this.store
    const { $children } = this
    const isStartPos = infinite && currentEventType !== "next" && startPos > 0
    const numOfSlides = calcNumberOfSlides(infinite, slidesPerPage, $children)
    const isPrevSlide = prevSlideIndex === 1 || prevSlideIndex === numOfSlides

    return isStartPos && isPrevSlide
  }

  private slideState(): Partial<StateType> {
    const { prevSlideIndex: prev, spacing } = this.store
    const { $children } = this
    const first = this.ghostIndex().FIRST
    const isFirst = prev === first || prev - 1 === first
    let index = null

    isFirst
      ? (index = this.ghostIndex().LAST)
      : (index = this.ghostIndex().FIRST)

    const translate = calcTranslate($children, spacing, index)

    return {
      slideIndex: index,
      isJumpSlide: true,
      currentTranslate: translate,
      prevTranslate: translate
    }
  }

  public ghostIndex(): Record<any, number> {
    const { $children } = this
    const { infinite, slidesPerPage } = this.store
    const numOfSlides = calcNumberOfSlides(infinite, slidesPerPage, $children)
    const [FIRST, LAST] = [numOfSlides, 1]

    return {
      FIRST,
      LAST
    }
  }

  public handleJumpSlide(): void {
    const { slideIndex } = this.store

    this.indeedIndex = slideIndex

    this.setState(this.slideState())
    this.animate(this.keyFrames(), this.options(0))
    this.waitForAction()
  }

  private waitForAction() {
    const { $root } = this
    const { currentEventType } = this.store
    const from = currentEventType
    const touchIndex = this.indeedIndex as number

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
  private jumpSlideState(condition: boolean): Partial<StateType> {
    return {
      isJumpSlide: condition
    }
  }
}
