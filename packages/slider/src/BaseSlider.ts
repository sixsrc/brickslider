import { Mutate } from "./Mutate"
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
  getSliderNodeList
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
  protected translate: number
  protected previousTranslate: number
  protected slidesArrBoundary: boolean
  protected slidesArr: HTMLElement[]
  protected targetSlides: HTMLElement[]
  protected isAtRightBoundary: boolean
  protected lastIndex: number
  prevSlides: HTMLElement[]
  subTranslate: number
  protected decrementCount: number
  protected isAnimating: boolean = false
  protected firstCloned: null | HTMLElement
  mutate: Mutate | null

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    // this.activeSlides = getSliderNodeList($root)
    this.slidesArr = getSliderNodeList($root)
    // this.slidesArr = Array.from(this.activeSlides)
    this.prevSlides = []
    this.targetSlides = []
    this.firstCloned = null
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
    this.mutate = null
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
    let activeSlides = this.slidesArr.filter(slide =>
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
      numberOfPages,
      slideIndex,
      activePage
    } = this.store

    const page = activePage + 1

    const isLeftOver = false //this.slidesArr.length % slidesPerView !== 1
    const isLimitRight =
      infinite && mov === "increment" && slideIndex === numberOfPages - 1
    let firstCloned = null

    const index = this.slidesArr.findIndex(slide => {
      return slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    })

    // this.prevSlides = [...this.targetSlides]

    /**
     * this.getLastIndex() + 1,
      isLimitRight && isLeftOver
        ? index + slidesPerPage
        : this.getLastIndex() + 1 + slidesPerPage - leftOverSlides
     */
    const isFirstSlideCloned = this.prevSlides.find(
      slide =>
        slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    )

    if (infinite && activePage === numberOfPages) {
      const index = this.slidesArr.findIndex(
        slide =>
          slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
      )
      this.setState({ jumpIndex: Number(index) })

      const isFirstCloned = this.prevSlides.some(
        slide => slide.dataset.index === "1"
      )

      const firstSlidePos = this.prevSlides.findIndex(
        slide => slide.dataset.index === "1"
      )

      if (firstSlidePos !== -1) {
        // Remove todos os elementos a partir do data-index="1"
        const filteredSlides = this.targetSlides.slice(0, firstSlidePos)

        // Se quiser substituir o array original
        this.targetSlides = filteredSlides
      }

      const slidesViewport = isFirstCloned
        ? slidesPerPage - (firstSlidePos + 1)
        : slidesPerPage
      //this.targetSlides.pop()
      //this.targetSlides = this.slidesArr.slice(index, 10)
      console.log("targetSlides", this.targetSlides, isFirstCloned)
      console.log("aaa", index, index + slidesViewport)

      //this.mutate?.teste(this.targetSlides)
    } else {
      this.setState({ jumpIndex: 0 })

      this.targetSlides = this.slidesArr.slice(
        this.getLastIndex() + 1,
        this.getLastIndex() + 1 + slidesPerPage - leftOverSlides
      )

      // this.mutate?.teste(this.targetSlides)

      if (leftOverSlides > 0) {
        console.log("aaa", this.targetSlides)
      }
    }
  }

  private decrementTargetSlides(slidesPerPage: number): void {
    const {
      infinite,

      activePage,
      currentSlideMovement: mov
    } = this.store
    // const isLeftOver = this.slidesArr.length % slidesPerView !== 1

    const isLimitLeft = infinite && mov === "decrement" && activePage === 0
    const clonedSlides = this.slidesArr.filter(slide =>
      hasClass(slide, CLASS_VALUES.CLONED)
    )
    const isLeftOver = false /*shouldApplyAdjustment(
      this.slidesArr.length,
      slidesPerPage,
      clonedSlides.length
    )*/

    //this.setState({ jumpIndex: 0 })

    //this.setState({ jumpIndex: 12 })

    if (infinite && mov === "decrement" && activePage === 0) {
      // this.slidesArrBoundary = true
    } else {
      // this.slidesArrBoundary = false
    }

    //- leftOverSlides

    const { leftOverSlides } = this.store
    const { leftOver } = this.getMissingSlides()

    const value = this.isAtRightBoundary ? leftOver : 0

    this.targetSlides = this.slidesArr.slice(
      Math.max(0, this.getLastIndex() - (slidesPerPage - value)),
      this.getLastIndex()
    )

    console.log("por voce", this.targetSlides, this.isAtRightBoundary)

    if (leftOverSlides > 0) {
      this.isAtRightBoundary = false
      // this.decrementCount++
      //  this.setState({ leftOverSlides: 0 })
    }
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
      console.log("filteredSlides", filteredSlides)
      //this.slidesArrBoundary = this.targetSlides
      ///this.slidesArrBoundary = filteredSlides
      this.isAtRightBoundary = true
      this.setState({ leftOverSlides: 1 })

      if (filteredSlides.length > 1) {
        //console.log("filteredSlides", filteredSlides.pop())
        //this.slidesArrBoundary.splice(0, 1)
      }
    } else {
      this.isAtRightBoundary = false
    }
  }

  private resetSlidesArrBoundary(): void {
    // if (this.slidesArrBoundary.length > 0) {
    //  this.targetSlides = this.slidesArrBoundary
    // this.slidesArrBoundary = []
    // }
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

    console.log("leftOver", leftOver)

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
