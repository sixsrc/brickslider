import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Observer } from "./Observer"
import { StateType } from "./State"
import { CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
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
  private slides: HTMLElement[]
  private observer: Observer

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.translate = 0
    this.slides = getSliderNodeList($root)
    this.observer = new Observer($root)
    this.initObserver()
  }

  private initObserver() {
    const observer = new MutationObserver(mutations => {
      this.observer.targetSlide(mutations, this.applyTranslate.bind(this))
    })

    this.forEachSlide(this.slides, slide => {
      observer.observe(slide, { attributes: true })
    })
  }

  private removeTranslate() {
    this.forEachSlide(this.slides, slide => {
      if (!hasClass(slide, CLASS_VALUES.ACTIVE)) {
        this.animate(slide, this.keyFrames(0.1), this.options(0))
      }
    })
  }

  private firstActiveSlide(element: HTMLElement[]) {
    const slide = element.find(slide => {
      return hasClass(slide, CLASS_VALUES.ACTIVE) && slide === element[0]
    })

    return slide
  }

  private lastActiveSlide(element: HTMLElement[]) {
    const slide = [...element]
      .reverse()
      .find(
        slide =>
          hasClass(slide, CLASS_VALUES.ACTIVE) &&
          slide === element[element.length - 1]
      )

    return slide
  }

  private applyTranslate(slide: HTMLElement) {
    const isFirstOrLastActive = this.isFirstOrLastActiveSlide(slide)
    const index = this.getSlideIndex(slide)
    const adjacentIndex = this.getAdjacentIndex(index)
    const translate = this.getTranslateValue()

    if (isFirstOrLastActive) {
      this.applyTranslateToAdjacent(adjacentIndex, translate)
    }
  }

  private getSlideIndex(slide: HTMLElement): number {
    return parseInt(slide.dataset.index as string)
  }

  private getAdjacentIndex(index: number): number {
    return this.firstActiveSlide(this.slides) ? index - 1 : index + 1
  }

  private getTranslateValue(): number {
    const { numberOfSlides, spacing } = this.store
    const singleTranslate = (this.sliderWidth! + spacing) * numberOfSlides
    return this.firstActiveSlide(this.slides)
      ? -singleTranslate
      : singleTranslate
  }

  private applyTranslateToAdjacent(adjacentIndex: number, translate: number) {
    this.forEachSlide(this.slides, slide => {
      if (this.getSlideIndex(slide) === adjacentIndex) {
        this.animate(slide, this.keyFrames(translate), this.options(0))
      }
    })
  }

  private isFirstOrLastActiveSlide(slide: HTMLElement): boolean {
    return (
      slide === this.firstActiveSlide(this.slides) ||
      slide === this.lastActiveSlide(this.slides)
    )
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    this.setIndexBased(params)
    this.mapSlideIndex() ? null : this.nextAction()
  }

  private nextAction() {
    this.animationFrame()
    this.calcTranslate()
    this.setState(this.mainState())
    this.updateSlider()
    this.setAnimationSlide()
    this.updateDOM()
  }

  private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType } = this.store
    const from = currentEventType as CurrentEventType
    const isTargetFrom = from === "dots"

    let { touchIndex } = params!

    if (touchIndex !== undefined) {
      if (infinite && isTargetFrom) touchIndex = touchIndex + 1
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

  protected setAnimationSlide() {
    const { infinite, slideIndex } = this.store
    const slide = this.slides[slideIndex]

    if (!infinite) return

    if (slide) {
      this.applyTranslate(slide)
    }
  }

  public defineDotIndex(): void {
    const { currentSlideMovement: mov } = this.store
    if (mov) {
      const { dotIndex } = this.defineIncrementOrDecrement()
      this.reorderActiveDot(dotIndex)
    }
  }

  private reorderActiveDot(dotIndex: number) {
    const { slideIndex, infinite } = this.store
    dotIndex = this.mapDotIndex().get(`${infinite}-${slideIndex}`) ?? dotIndex
    this.setState({ dotIndex })
  }

  private mapDotIndex(): Map<string, number | undefined> {
    const { slideIndex, numberOfSlides, infinite } = this.store
    const dotIndexMap = new Map<string, number | undefined>([
      [`true-0`, infinite ? numberOfSlides - 1 : 0],
      [`true-${numberOfSlides + 1}`, infinite ? 0 : undefined],
      [`false-${numberOfSlides - 1}`, slideIndex]
    ])

    return dotIndexMap
  }

  protected defineIncrementOrDecrement() {
    let { currentSlideMovement: mov, dotIndex } = this.store
    if (mov === "increment") dotIndex++
    else dotIndex--

    return { dotIndex }
  }

  public updateSlider() {
    this.removeTranslate()
    this.defineDotIndex()
    this.updateDots(this.$root)
  }

  protected updateDOM(): void {
    const { slidesPerPage } = this.store
    const { $root, currentIndex } = this
    toggleClass(getSliderNodeList($root), currentIndex, slidesPerPage)
  }

  public updateDots($root: string): void {
    const { dotIndex } = this.store
    const selectedIndex = dotIndex ?? 0
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
