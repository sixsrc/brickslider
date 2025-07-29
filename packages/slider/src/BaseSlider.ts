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
  protected $track: HTMLElement
  protected trackChildren: HTMLElement
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected movement: boolean
  protected firstDataIndex: number
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

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.slidesArr = getSliderNodeList($root)
    this.prevSlides = []
    this.targetSlides = []
    this.firstCloned = null
    this.isAtRightBoundary = false
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.$track = getTrackChildren($root) as HTMLElement
    this.trackChildren = getTrackChildren($root) as HTMLElement
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.movement = false

    this.firstDataIndex = 0
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

  /*protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): void {
    animateElement(element, keyFrames, options)
  }*/

  protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): Animation[] {
    const animations = animateElement(element, keyFrames, options)
    console.log("Animações criadas:", animations)
    return animations
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
    }
  }

  private incrementTargetSlides(slidesPerPage: number) {
    const { infinite, leftOverSlides, numberOfPages, activePage } = this.store
    this.lastIndex = 0
    console.log("cansaaaaaado", this.lastIndex)
    if (infinite && activePage === numberOfPages) {
      const index = this.slidesArr.findIndex(
        slide =>
          slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
      )
      this.setState({ jumpIndex: Number(index) })

      const firstSlidePos = this.prevSlides.findIndex(
        slide => slide.dataset.index === "1"
      )

      if (firstSlidePos !== -1) {
        // Remove todos os elementos a partir do data-index="1"
        const filteredSlides = this.targetSlides.slice(0, firstSlidePos)

        // Se quiser substituir o array original
        this.targetSlides = filteredSlides
      }
    } else {
      this.setState({ jumpIndex: 0 })

      this.targetSlides = this.slidesArr.slice(
        this.getLastIndex() + 1,
        this.getLastIndex() + 1 + slidesPerPage - leftOverSlides
      )
    }
  }

  /*private decrementTargetSlides(slidesPerPage: number): void {
    //    const { leftOver } = this.getMissingSlides()
    //- leftOverSlides
    const { leftOverSlides } = this.store
    const value = this.isAtRightBoundary ? leftOverSlides : 0
    const isSmaller = slidesPerPage - value < 0
    const calc = [value - slidesPerPage, slidesPerPage - value]

    this.targetSlides = this.slidesArr.slice(
      Math.max(0, this.getLastIndex() - (isSmaller ? calc[0] : calc[1])),
      this.getLastIndex()
    )

    console.log("decremet target", calc[0], calc[1])

    if (leftOverSlides > 0) this.isAtRightBoundary = false
  }*/

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

    const { leftOverSlides, slidesPerView } = this.store
    const { leftOver } = this.getMissingSlides()
    const value = this.isAtRightBoundary ? leftOverSlides : 0

    this.targetSlides = this.slidesArr.slice(
      Math.max(0, this.getLastIndex() - (slidesPerPage - value)),
      this.getLastIndex()
    )

    const lastActiveSlide = this.getLastActiveSlide().lastActiveSlide
    const index = this.getAdjustedStartIndex(
      parseInt(lastActiveSlide.dataset.index as string)
    )

    console.log("asasa", leftOverSlides)
    console.log("lastActiveSlide", index)

    if (leftOverSlides > 0) {
      //this.lastIndex = index
      this.isAtRightBoundary = false
      // this.decrementCount++
      //  this.setState({ leftOverSlides: 0 })
    } else {
      //this.lastIndex = 8
    }
  }

  private setRightBoundary() {
    const { isMissing } = this.getMissingSlides()
    const { infinite, slidesPerView, slideIndex, numberOfSlides } = this.store

    if (infinite) {
      if (slideIndex > numberOfSlides - 1)
        this.handleInfiniteBoundary(isMissing)
      //this.handleNonInfiniteBoundary(isMissing, slidesPerView, leftOver)
    } else {
      this.handleNonInfiniteBoundary(slidesPerView)
    }
  }

  /*protected getAdjustedStartIndex(currentIndex: number, slidesPerView: number) {
    const totalSlides = this.slidesArr.length
    const slidesRemaining = totalSlides - currentIndex
    const missing = Math.max(0, slidesPerView - slidesRemaining)
    const adjustedStart = currentIndex - missing
    return Math.max(0, adjustedStart)
  }*/

  /*protected getAdjustedStartIndex(currentIndex: number) {
    const totalSlides = this.slidesArr.length
    const { slidesPerView, currentSlideMovement: direction } = this.store

    if (direction === "increment") {
      const slidesRemaining = totalSlides - currentIndex
      const missing = Math.max(0, slidesPerView - slidesRemaining)
      return Math.max(0, currentIndex - missing)
    }

    if (direction === "decrement") {
      return Math.max(0, currentIndex - slidesPerView)
    }

    return currentIndex
  }*/

  protected getAdjustedStartIndex(currentIndex: number): number {
    const totalSlides = this.slidesArr.length
    const {
      slidesPerView,
      currentSlideMovement: direction,
      leftOverSlides
    } = this.store

    // Se não há sobra, retorna o índice original sem compensar
    if (leftOverSlides === 0) return currentIndex

    // Caso haja sobra (leftOverSlides > 0), aplicar cálculo de compensação
    if (direction === "increment") {
      const slidesRemaining = totalSlides - currentIndex
      const missing = Math.max(0, slidesPerView - slidesRemaining)
      return Math.max(0, currentIndex - missing)
    }

    if (direction === "decrement") {
      return Math.max(0, currentIndex - slidesPerView)
    }

    return currentIndex
  }

  private handleInfiniteBoundary(isMissing: boolean) {
    if (isMissing && this.isAtRightBoundary) {
      // const withClonedRight = this.withClonedSlidesRight(this.slidesArr)
      // this.slidesArr = [...withClonedRight, ...withoutClonedRight]
    }
  }

  private handleNonInfiniteBoundary(slidesPerView: number) {
    const lastIndex = parseInt(
      this.getLastActiveSlide().lastActiveSlide.dataset.index as string,
      10
    )

    const filteredSlides = Array.from(this.slidesArr).filter(slide => {
      const index = parseInt(slide.getAttribute("data-index") as string, 10)
      return index > lastIndex //this.lastIndex + 1
    })

    if (filteredSlides.length < slidesPerView) {
      this.isAtRightBoundary = true
      this.setState({ leftOverSlides: slidesPerView - filteredSlides.length })
      this.lastIndex = this.getAdjustedStartIndex(lastIndex)
      console.log("lastIndex", this.lastIndex)
    } else {
      this.isAtRightBoundary = false
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

  protected getDataIndex(slide: HTMLElement): string {
    const dataIndex = slide.dataset.index

    if (dataIndex) {
      return dataIndex
    }

    throw new Error("Data index not found on slide element.")
  }
}
