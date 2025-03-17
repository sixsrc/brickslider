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
  // private activeSlides: HTMLElement[]
  protected translate: number
  protected previousTranslate: number
  protected slidesArrBoundary: HTMLElement[]
  private slidesArr: HTMLElement[]
  private targetSlides: HTMLElement[]
  private isAtRightBoundary: boolean
  private lastIndex: number
  prevSlides: HTMLElement[]
  subTranslate: number

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    // this.activeSlides = getSliderNodeList($root)
    this.slidesArr = getSliderNodeList($root)
    // this.slidesArr = Array.from(this.activeSlides)
    this.prevSlides = []
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
    this.subTranslate = 0
    this.previousTranslate = 0
    this.dotIndex = 0
    this.lastIndex = 0
    this.slidesArrBoundary = []
  }

  public static getSlides($root: string, cloned?: boolean) {
    return getSliderNodeList($root, cloned)
  }

  protected localState(state: {
    slidesArr: []
    targetSlides: []
    slidesArrBoundary: []
    isAtRightBoundary: false
  }): {
    slidesArr: []
    targetSlides: []
    slidesArrBoundary: []
    isAtRightBoundary: false
  } {
    return {
      ...state,
      slidesArr: [],
      targetSlides: [],
      slidesArrBoundary: [],
      isAtRightBoundary: false
    }
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

    this.prevSlides = [...this.targetSlides]

    if (isIncrement) {
      this.incrementTargetSlides(slidesPerPage)
      this.setRightBoundary()
    } else {
      this.decrementTargetSlides(slidesPerPage)
      this.resetSlidesArrBoundary()
    }
  }

  private incrementTargetSlides(slidesPerPage: number) {
    this.targetSlides = this.slidesArr.slice(
      this.getLastIndex() + 1,
      this.getLastIndex() + 1 + slidesPerPage
    )

    this.lastIndex = this.slidesArr.indexOf(
      this.targetSlides[this.targetSlides.length - 1]
    )

    console.log("teste slides", this.slidesArr)

    this.isAtRightBoundary = this.lastIndex === this.slidesArr.length - 1
  }

  private decrementTargetSlides(slidesPerPage: number): void {
    this.targetSlides = this.slidesArr.slice(
      Math.max(0, this.getLastIndex() - slidesPerPage),
      this.getLastIndex()
    )
  }

  private removeClonedSlidesRight(slides: HTMLElement[]): HTMLElement[] {
    const clonedSlidesRight = slides.filter(
      slide =>
        hasClass(slide, CLASS_VALUES.CLONED) &&
        hasClass(slide, CLASS_VALUES.END)
    )

    return slides.filter(slide => !clonedSlidesRight.includes(slide))
  }

  private withClonedSlidesRight(slides: HTMLElement[]): HTMLElement[] {
    const clonedSlidesRight = slides.filter(
      slide =>
        hasClass(slide, CLASS_VALUES.CLONED) &&
        hasClass(slide, CLASS_VALUES.START)
    )

    return slides.filter(slide => !clonedSlidesRight.includes(slide))
  }

  private setRightBoundary() {
    const { isMissing, leftOver } = this.getMissingSlides()
    const { infinite, slidesPerView, slideIndex, numberOfSlides } = this.store

    if (infinite) {
      if (slideIndex > numberOfSlides - 1)
        this.handleInfiniteBoundary(isMissing)
    } else {
      this.handleNonInfiniteBoundary(isMissing, slidesPerView, leftOver)
    }
  }

  private handleInfiniteBoundary(isMissing: boolean) {
    //const withoutClonedRight = this.removeClonedSlidesRight(this.slidesArr)

    ///this.slidesArr = [...withoutClonedRight]

    console.log("slideIndex", this.targetSlides)

    if (isMissing && this.isAtRightBoundary) {
      // const withClonedRight = this.withClonedSlidesRight(this.slidesArr)
      // this.slidesArr = [...withClonedRight, ...withoutClonedRight]
    }
  }

  private handleNonInfiniteBoundary(
    isMissing: boolean,
    slidesPerView: number,
    leftOver: number
  ) {
    if (!isMissing || !this.isAtRightBoundary) return

    this.slidesArrBoundary = this.targetSlides

    if (this.targetSlides.length < slidesPerView) {
      this.setState({ leftOverSlides: leftOver })
      this.targetSlides.length > 1 && this.targetSlides.splice(0, leftOver)
    }
  }

  private resetSlidesArrBoundary(): void {
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

  protected getMissingSlides(): getMissingSlides {
    const { slidesPerPage, slidesPerView } = this.store
    const slides = BaseSlider.getSlides(this.$root, false).length
    const calc1 = slides % slidesPerPage
    const calc2 = slides % slidesPerView
    const leftOver = calc1 > 0 ? calc1 : calc2
    const isMissing = leftOver > 0

    return { isMissing, leftOver }
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

// if (!lastActiveSlide) return 0
//    const { lastActiveSlide } = this.getLastActiveSlide()
/*
   this.targetSlides.forEach(slide => {
      translate += slide.offsetWidth + spacing
    })
  */
/*private setRightBoundary() {
    const { isMissing, leftOver } = this.getMissingSlides()
    const { infinite, slidesPerView } = this.store
    const withoutClonedRight = this.removeClonedSlidesRight(this.slidesArr)
    const withClonedRight = this.withClonedSlidesRight(this.slidesArr)

    this.isAtRightBoundary = this.lastIndex === this.slidesArr.length - 1

    if (infinite) this.slidesArr = [...withoutClonedRight]

    if (isMissing && this.isAtRightBoundary) {
      if (!infinite) {
        this.slidesArrBoundary = this.targetSlides

        if (this.targetSlides.length < slidesPerView) {
          this.setState({ leftOverSlides: this.targetSlides.length })

          if (this.targetSlides.length > 1) {
            this.targetSlides.splice(0, leftOver)
          }
        }
      } else {
        this.slidesArr = [...withClonedRight, ...withoutClonedRight]
      }
    }
  }*/
