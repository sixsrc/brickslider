import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"
import { Observer } from "./Observer"
import { StateType } from "./State"
import { CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  indexBasedBy,
  isNotMapped,
  removeClass,
  toggleClass2
} from "./helpers"
import { CurrentEventType, TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: AnimationFrame
  private currentIndex: number
  //private translate: number
  private slides: HTMLElement[]
  mutate: Mutate
  static slides: any

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    // this.translate = 0
    this.slides = getSliderNodeList($root)
    this.mutate = new Mutate($root)
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

  private getSlideIndex(slide: HTMLElement): number {
    return parseInt(slide.dataset.index as string)
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
    this.updateDOM()
    this.updateSlider()
  }

  private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType } = this.store
    const from = currentEventType as CurrentEventType
    const isTargetFrom = from === "dots"

    let { touchIndex } = params!

    if (touchIndex !== undefined) {
      if (infinite && isTargetFrom) touchIndex = touchIndex + 1
    }

    this.currentIndex = indexBasedBy({
      from,
      slideIndex,
      touchIndex
    })
  }

  private mapSlideIndex(): boolean {
    const { infinite, numberOfSlides } = this.store
    const { currentIndex } = this

    return isNotMapped(infinite, currentIndex, numberOfSlides)
  }

  private animationFrame() {
    requestAnimationFrame(this.animation.init)
  }

  private mainState(): Partial<StateType> {
    let { currentIndex, translate } = this
    const { currentEventType, currentSlideMovement: mov } = this.store
    const isDotTarget = currentEventType === "dots"
    const startPos = isDotTarget ? { startPos: 0 } : {}

    translate =
      mov === "increment"
        ? translate + Math.abs(this.store.currentTranslate)
        : Math.abs(this.store.currentTranslate) - translate

    return {
      ...startPos,
      slideIndex: currentIndex,
      prevTranslate: -translate,
      currentTranslate: -translate
    }
  }

  public defineDotIndex(): void {
    const { currentSlideMovement: mov, isPagedActive } = this.store

    if (mov && isPagedActive) {
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
    this.defineDotIndex()
    this.updateDots(this.$root)
  }

  protected updateDOM(): void {
    const { slidesPerPage, slidesPerView, currentSlideMovement } = this.store
    const { $root, currentIndex } = this

    toggleClass2(
      getSliderNodeList($root),
      currentIndex,
      slidesPerView,
      slidesPerPage,
      currentSlideMovement
    )
  }

  public updateDots($root: string) {
    const { dotIndex } = this.store
    const selectedIndex = dotIndex ?? 0
    const { dots: isDots } = this.store
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))

    if (!isDots) return {}

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
    })
  }
}

/*

 if (currentIndex <= 0) {
      // translate = 0
    }

if (infinite && slidesPerView >= 2) {
      //currentIndex += 1
    }
*/
/* private applyTranslateToAdjacent(adjacentIndex: number, translate: number) {
    const lastSlide = this.slides[this.slides.length - 1]
    const lastSlideIndex = parseInt(lastSlide.dataset.index as string)
    const missingSlides = this.getMissingSlides()
    const slideWidthWithMargin = lastSlide.offsetWidth + this.store.spacing

    const adjustedTranslate = translate - slideWidthWithMargin
    const targetIndex = lastSlideIndex + 1

    this.forEachSlide(this.slides, slide => {
      if (this.getSlideIndex(slide) === targetIndex) {
        // Aplica o translate ajustado ao slide que seria o "próximo"

        this.animate(slide, this.keyFrames(adjustedTranslate), this.options(0))
      } else if (this.getSlideIndex(slide) === adjacentIndex) {
        // Aplica o translate normal para os outros slides adjacentes
        this.animate(slide, this.keyFrames(translate), this.options(0))
      }
    })
  }*/
/* protected calcTranslate(): number {
    // let { currentIndex } = this
    // currentIndex = this.checkCurrentIndex(currentIndex)

    this.translate = this.getSlidesSizes() as number

    return this.translate
  }*/
