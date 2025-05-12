import { State, type StateType } from "./State"
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
  getSliderNodeList,
  waitFor,
  shouldApplyAdjustment
} from "./helpers"
import type {
  AnimationOptions,
  KeyframeAnimation,
  MouseEventOrTouchEvent
} from "./types"

export class BaseSlider {
  protected $root: string
  protected getRootSelector: HTMLElement | undefined
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected trackChildren: HTMLElement
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected movement: boolean
  protected dotIndex: number
  // private activeSlides: HTMLElement[]
  protected translate: number
  protected previousTranslate: number
  protected slidesArrBoundary: boolean
  protected slidesArr: HTMLElement[]
  protected targetSlides: HTMLElement[]
  private isAtRightBoundary: boolean
  protected lastIndex: number
  prevSlides: HTMLElement[]
  subTranslate: number
  protected decrementCount: number
  protected isAnimating: boolean = false
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
    this.trackChildren = getTrackChildren($root) as HTMLElement
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.movement = false
    this.translate = 0
    this.subTranslate = 0
    this.previousTranslate = 0
    this.dotIndex = 0
    this.lastIndex = 0
    this.slidesArrBoundary = false
    this.decrementCount = 0
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

    this.prevSlides = [...this.targetSlides]

    if (isIncrement) {
      this.setRightBoundary()
      this.incrementTargetSlides(slidesPerPage)
    } else {
      this.decrementTargetSlides(slidesPerPage)
      this.resetSlidesArrBoundary()
    }
  }

  private incrementTargetSlides(slidesPerPage: number) {
    const {
      infinite,
      leftOverSlides,
      currentSlideMovement: mov,
      activePage,
      numberOfPages,
      slidesPerView
    } = this.store

    const isLeftOver = this.slidesArr.length % slidesPerView !== 1
    const isLimitRight =
      infinite && mov === "increment" && activePage === numberOfPages - 1

    if (isLimitRight) {
      this.slidesArrBoundary = true
    } else {
      this.slidesArrBoundary = false
    }

    const index = this.slidesArr.findIndex(slide => {
      return slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    })

    this.targetSlides = this.slidesArr.slice(
      this.getLastIndex() + 1,
      isLimitRight && isLeftOver
        ? index + slidesPerPage
        : this.getLastIndex() + 1 + slidesPerPage - leftOverSlides
    )

    /// this.getLastIndex() + 1 + slidesPerPage - leftOverSlides

    this.lastIndex = this.slidesArr.indexOf(
      this.targetSlides[this.targetSlides.length - 1]
    )
  }

  private decrementTargetSlides(slidesPerPage: number): void {
    const {
      infinite,
      slidesPerView,
      leftOverSlides,
      activePage,
      currentSlideMovement: mov
    } = this.store
    // const isLeftOver = this.slidesArr.length % slidesPerView !== 1

    const isLimitLeft = infinite && mov === "decrement" && activePage === 0
    const clonedSlides = this.slidesArr.filter(slide =>
      hasClass(slide, CLASS_VALUES.CLONED)
    )
    const isLeftOver = shouldApplyAdjustment(
      this.slidesArr.length,
      slidesPerPage,
      clonedSlides.length
    )

    if (infinite && mov === "decrement" && activePage === 0) {
      this.slidesArrBoundary = true
    } else {
      this.slidesArrBoundary = false
    }

    this.targetSlides = this.slidesArr.slice(
      Math.max(
        0,
        this.getLastIndex() -
          (isLimitLeft && isLeftOver
            ? slidesPerView
            : slidesPerPage - leftOverSlides)
      ),
      this.getLastIndex()
    )

    //console.log("targetSlides", this.targetSlides)

    console.log("this.lastIndex", this.lastIndex)

    if (leftOverSlides > 0) {
      this.decrementCount++

      // this.setState({ leftOverSlides: 0 })
    }

    console.log("targetSlides", this.targetSlides)
  }

  private setRightBoundary() {
    const { isMissing, leftOver } = this.getMissingSlides()
    const { infinite, slidesPerView, slideIndex, numberOfSlides } = this.store

    if (infinite) {
      if (slideIndex > numberOfSlides - 1)
        this.handleInfiniteBoundary(isMissing)
      //this.handleNonInfiniteBoundary(isMissing, slidesPerView, leftOver)
    } else {
      this.handleNonInfiniteBoundary(isMissing, slidesPerView, leftOver)
    }
  }

  private handleInfiniteBoundary(isMissing: boolean) {
    //const withoutClonedRight = this.removeClonedSlidesRight(this.slidesArr)

    ///this.slidesArr = [...withoutClonedRight]

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
    //if (!isMissing || !this.isAtRightBoundary) return

    //this.setState({ leftOverSlides: 1 })

    const lastIndex = parseInt(
      this.getLastActiveSlide().lastActiveSlide.dataset.index as string,
      10
    )

    const filteredSlides = Array.from(this.slidesArr).filter(slide => {
      const index = parseInt(slide.getAttribute("data-index") as string, 10)
      return index > lastIndex //this.lastIndex + 1
    })

    if (filteredSlides.length < slidesPerView) {
      //this.slidesArrBoundary = this.targetSlides
      ///this.slidesArrBoundary = filteredSlides
      this.setState({ leftOverSlides: 1 })

      if (filteredSlides.length > 1) {
        //console.log("filteredSlides", filteredSlides.pop())
        //this.slidesArrBoundary.splice(0, 1)
      }
    }
  }

  private resetSlidesArrBoundary(): void {
    // if (this.slidesArrBoundary.length > 0) {
    //  this.targetSlides = this.slidesArrBoundary
    // this.slidesArrBoundary = []
    // }
  }

  private activeSlidesLoop(): number {
    const { spacing, slidesPerPage } = this.store
    let translate = 0

    this.setTargetSlides()

    const hasClonedSlides = this.targetSlides.some(slide =>
      hasClass(slide, CLASS_VALUES.CLONED)
    )

    if (hasClonedSlides) {
      waitFor(600, () => {
        const baseIndex = this.slidesArr.findIndex(
          slide =>
            slide.dataset.index === "1" &&
            slide.classList.contains(CLASS_VALUES.CLONED)
        )
        // this.targetSlides = this.slidesArr.slice(0, 29)

        /* this.lastIndex = this.slidesArr.indexOf(
          this.targetSlides[this.targetSlides.length - 1]
        )*/

        // console.log("targetSlides", this.targetSlides)
      })
      //return this.sliderWidth! + spacing
    }

    this.forEachSlide(this.targetSlides, slide => {
      translate += slide.offsetWidth + spacing
    })

    return translate
  }

  /*protected getMissingSlides(): getMissingSlides {
    const { slidesPerPage, slidesPerView } = this.store
    const slides = BaseSlider.getSlides(this.$root, false).length
    const calc1 = slides % slidesPerPage
    const calc2 = slides % slidesPerView
    const leftOver = calc1 > 0 ? calc1 : calc2
    const isMissing = leftOver > 0

    //console.log("calc1", calc1, "calc2", calc2)

    return { isMissing, leftOver }
  }*/

  protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const lastPageSlides = totalSlides % slidesPerPage || slidesPerPage
    const leftOver = Math.max(0, slidesPerView - lastPageSlides)

    return { isMissing: leftOver > 0, leftOver }
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
