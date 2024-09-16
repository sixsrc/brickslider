import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
  animateElement,
  calcTranslate,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  indexBasedBy,
  isNotMapped,
  removeClass,
  toggleClass
} from "./helpers"
import { CurrentEventType, TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: any
  private currentIndex: number
  private translate: number
  private currentAnimation: any[]

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.translate = 0
    this.currentAnimation = []
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    this.setIndexBased(params)
    this.mapSlideIndex() ? null : this.nextAction()
  }

  private nextAction() {
    this.animationFrame()
    this.calcTranslate()
    this.setState(this.mainState())
    this.updateDOM()
  }

  private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType } = this.store
    const from = currentEventType as CurrentEventType
    const isTargetFrom = from === "next" || "prev"

    let { touchIndex } = params!

    if (touchIndex !== undefined) {
      if (infinite && isTargetFrom) {
        //touchIndex = touchIndex + 1
      }
    }

    this.currentIndex = indexBasedBy({ from, slideIndex, touchIndex })
  }

  private mapSlideIndex(): boolean {
    const { infinite, numberOfSlides } = this.store

    return isNotMapped(infinite, this.currentIndex, numberOfSlides)
  }

  private animationFrame() {
    requestAnimationFrame(this.animation.init)
  }

  protected calcTranslate(): number {
    const { spacing } = this.store
    const { $children, currentIndex } = this

    this.translate = calcTranslate($children!, spacing, currentIndex)

    return this.translate
  }

  private mainState(): Partial<StateType> {
    const { currentIndex, translate } = this
    const { currentEventType } = this.store
    const isDotTarget = currentEventType === "dots"
    const startPos = isDotTarget ? { startPos: 0 } : {}

    return {
      ...startPos,
      slideIndex: currentIndex,
      prevTranslate: translate,
      currentTranslate: translate
    }
  }

  protected updateDOM(): void {
    const { infinite, slidesPerPage, slideIndex, numberOfSlides, spacing } =
      this.store
    const { $root, currentIndex } = this
    const slides = getSliderNodeList($root, false)
    const lastSlide = slides[2]
    const singleTranslate = (this.sliderWidth! + spacing) * numberOfSlides

    if (infinite && slidesPerPage <= 1 && slideIndex === 0) {
      this.currentAnimation = animateElement(
        lastSlide,
        this.keyFrames(-singleTranslate),
        this.options(0)
      )

      this.setState({
        currentAnimation: this.currentAnimation
      })
    }

    toggleClass(getSliderNodeList($root), currentIndex, slidesPerPage)
  }

  public updateDots(index: number, $root: string): void {
    const selectedIndex = index ?? 0
    const { dots: isDots } = this.store
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))

    if (!isDots) return

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
    })
  }
}
