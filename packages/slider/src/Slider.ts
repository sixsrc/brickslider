import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
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

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.translate = 0
    this.slides = getSliderNodeList($root)

    this.initializeObserver()
  }

  private initializeObserver() {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          const targetSlide = mutation.target as HTMLElement
          if (hasClass(targetSlide, CLASS_VALUES.ACTIVE)) {
            this.applyTranslate(targetSlide)
          } else {
            this.removeTranslateFromSlide(targetSlide)
          }
        }
      })
    })

    this.slides.forEach(slide => {
      observer.observe(slide, { attributes: true })
    })
  }

  private removeTranslateFromInactiveSlides() {
    this.slides.forEach(slide => {
      if (!hasClass(slide, CLASS_VALUES.ACTIVE)) {
        this.removeTranslateFromSlide(slide)
      }
    })
  }

  private removeTranslateFromSlide(slide: HTMLElement) {
    slide.style.transform = ""
  }

  private applyTranslate(slide: HTMLElement) {
    const { slides } = this
    const firstActiveSlide = slides.find(slide => {
      return hasClass(slide, CLASS_VALUES.ACTIVE) && slide === slides[0]
    })

    const lastActiveSlide = [...slides]
      .reverse()
      .find(
        slide =>
          hasClass(slide, CLASS_VALUES.ACTIVE) &&
          slide === slides[slides.length - 1]
      )

    if (slide === firstActiveSlide || slide === lastActiveSlide) {
      slide.style.transform = `translateX(${this.translate}px)`
    }
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
    if (!infinite) return

    const slide = this.slides[slideIndex]
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
    this.removeTranslateFromInactiveSlides()
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
