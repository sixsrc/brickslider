import { State, StateType } from "./State"
import { ANIMATION_OPTIONS, CLASS_VALUES } from "./constants"
import {
  animateElement,
  getEventType,
  getChildren,
  getChildrenCount,
  getRootSelector,
  getSliderWidth,
  getTrackChildren,
  translate3d,
  hasClass,
  getSliderNodeList
} from "./helpers"
import {
  AnimationOptions,
  getMissingSlides,
  KeyframeAnimation,
  MouseEventOrTouchEvent
} from "./types"

export class BaseSlider {
  protected $root: string
  protected getRootSelector: HTMLElement | undefined
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected getTrackChildren: HTMLElement | any
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected movement: boolean
  protected dotIndex: number
  private activeSlides: HTMLElement[]
  protected translate: number
  protected previousTranslate: number
  protected slidesArrBoundary: HTMLElement[]
  private slidesArr: HTMLElement[]
  private targetSlides: HTMLElement[]
  private isAtRightBoundary: boolean
  private lastIndex: number

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.activeSlides = getSliderNodeList($root)
    this.slidesArr = Array.from(this.activeSlides)
    this.targetSlides = []
    this.isAtRightBoundary = false
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.getTrackChildren = getTrackChildren($root)
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.movement = false
    this.translate = 0
    this.previousTranslate = 0
    this.dotIndex = 0
    this.lastIndex = 0
    this.slidesArrBoundary = []
  }

  public static getSlides($root: string, cloned?: boolean) {
    return getSliderNodeList($root, cloned)
  }

  protected defineEventTarget(event: MouseEventOrTouchEvent) {
    const clientX = getEventType(event).clientX
    const clientY = getEventType(event).clientY

    return {
      clientX,
      clientY
    }
  }

  protected forEachSlide(
    slides: HTMLElement[],
    callback: (slide: HTMLElement, index: number) => void
  ): void {
    slides.forEach((slide, index) => callback(slide, index))
  }

  protected isDotTarget(numberOfSlides: number): void {
    if (this.dotIndex === -1) this.dotIndex = numberOfSlides - 1
    else if (this.dotIndex === numberOfSlides) this.dotIndex = 0
  }

  protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): void {
    animateElement(element, keyFrames, options)
  }

  protected calcTranslate(): number {
    this.translate = this.getSlidesSizes() as number

    return this.translate
  }

  private getLastActiveSlide() {
    const activeSlides = this.slidesArr.filter(slide =>
      hasClass(slide, CLASS_VALUES.ACTIVE)
    )
    const lastActiveSlide = activeSlides[activeSlides.length - 1]

    return { lastActiveSlide }
  }

  private getLastIndex(): number {
    const { lastActiveSlide } = this.getLastActiveSlide()
    const lastIndex = this.slidesArr.indexOf(lastActiveSlide)

    return lastIndex
  }

  private setTargetSlides(): void {
    const { slidesPerPage, currentSlideMovement } = this.store
    const isIncrement = currentSlideMovement === "increment"

    const slidesToUse = this.isAtRightBoundary
      ? this.slidesArr.filter(slide => !hasClass(slide, CLASS_VALUES.CLONED))
      : this.slidesArr

    console.log("slidestouse", slidesToUse)
    if (isIncrement) {
      this.incrementTargetSlides(slidesToUse, slidesPerPage)
      this.setRightBoundary(slidesToUse)
    } else {
      this.decrementTargetSlides(slidesToUse, slidesPerPage)
      this.setSlidesArrBoundary()
    }
  }

  private incrementTargetSlides(slides: HTMLElement[], slidesPerPage: number) {
    this.targetSlides = slides.slice(
      this.getLastIndex() + 1,
      this.getLastIndex() + 1 + slidesPerPage
    )
    this.lastIndex = slides.indexOf(
      this.targetSlides[this.targetSlides.length - 1]
    )
    console.log("lastIndex", this.lastIndex)
  }

  private setRightBoundary(slides: HTMLElement[]) {
    const { isMissing, leftOver } = this.getMissingSlides()

    this.isAtRightBoundary = this.lastIndex === slides.length - 1

    if (this.isAtRightBoundary && isMissing) {
      this.slidesArrBoundary = this.targetSlides
      console.log("targetSlides", this.activeSlides)
      this.targetSlides.splice(leftOver)
    }
  }

  private decrementTargetSlides(
    slides: HTMLElement[],
    slidesPerPage: number
  ): void {
    this.targetSlides = slides.slice(
      Math.max(0, this.getLastIndex() - slidesPerPage),
      this.getLastIndex()
    )
  }

  private setSlidesArrBoundary(): void {
    if (this.slidesArrBoundary.length > 0) {
      this.targetSlides = this.slidesArrBoundary
      this.slidesArrBoundary = []
    }
  }

  private activeSlidesLoop(): number {
    const { spacing } = this.store
    let translate = 0

    this.setTargetSlides()

    this.forEachSlide(this.targetSlides, slide => {
      translate += slide.offsetWidth + spacing
    })

    return translate
  }

  private getMissingSlides(): getMissingSlides {
    const { slidesPerPage, infinite } = this.store
    const slides = BaseSlider.getSlides(this.$root, false).length
    const totalSlides = infinite ? slides : slides
    const remainder = totalSlides % slidesPerPage
    const leftOver = totalSlides % slidesPerPage

    return { isMissing: remainder, leftOver }
  }

  protected getSlidesSizes(): number | undefined {
    if (!this.getLastActiveSlide()) return

    return this.activeSlidesLoop()
  }

  protected options(duration = 0): AnimationOptions {
    return {
      duration,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }

  protected keyFrames(translate?: number): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      { transform: translate3d(translate ? translate : currentTranslate) }
    ]
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }
}
