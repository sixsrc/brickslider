import { Slider } from "./Slider"
import { state, State, type StateType } from "./State"
import { ANIMATION_OPTIONS } from "./constants"
import {
  animateElement,
  getEventType,
  getChildren,
  getChildrenCount,
  getRootSelector,
  getSliderWidth,
  getTrackChildren,
  translate3d,
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
  protected lastIndex: number
  prevSlides: HTMLElement[]
  subTranslate: number
  protected decrementCount: number
  protected isAnimating: boolean = false
  protected firstCloned: null | HTMLElement
  protected isIncompleteGroup: boolean

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.slidesArr = getSliderNodeList($root)
    this.prevSlides = []
    this.targetSlides = []
    this.firstCloned = null
    this.isIncompleteGroup = false
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

  protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): Animation[] {
    const animations = animateElement(element, keyFrames, options)

    return animations
  }

  protected calcTranslate(): number {
    this.translate = this.getSlidesSizes() as number

    return this.translate
  }

 
  private getLastActiveSlide() {
    const { activePage, slidesPerPage } = this.store
    const start = activePage * slidesPerPage
    const end = start + slidesPerPage
    const lastActiveSlide = this.slidesArr[end - 1]

    return { lastActiveSlide }
  }

  private setTargetSlides(): void {
    const { slidesPerPage, activePage, activeDataIndex, slidesPerView } =
      this.store
    const totalSlides = this.slidesArr.length
    const start = activePage * slidesPerPage
    const rawEnd = start + slidesPerView
    let visibleStart = start
    let visibleEnd = rawEnd

    // Ajustar final se passar do total
    if (visibleEnd > totalSlides) {
      visibleEnd = totalSlides
      visibleStart = Math.max(0, visibleEnd - slidesPerView)
    }

    // Só os ativos: os primeiros slidesPerPage do intervalo visível

    this.prevSlides = [...this.targetSlides]

    const lastSlide = this.targetSlides[this.targetSlides.length - 1]
    const lastIndexStr = lastSlide?.dataset.index
    const undef = undefined
    this.lastIndex = lastIndexStr !== undef ? parseInt(lastIndexStr, 10) : -1

    //this.lastIndex = visibleStart

    const filteredSlides = Array.from(this.slidesArr).filter(slide => {
      const index = parseInt(slide.getAttribute("data-index") as string, 10)
      return index > activeDataIndex
    })

    console.log("filtered slides", filteredSlides)

    const { currentSlideMovement: mov } = this.store

    if (mov === "increment") {
      if (filteredSlides.length < slidesPerView) {
        this.isIncompleteGroup = true
        this.setState({ leftOverSlides: slidesPerView - filteredSlides.length })
      }
    } else {
      if (this.isIncompleteGroup) {
        this.isIncompleteGroup = false
        console.log("bbb", this.store["leftOverSlides"])
      } else {
        this.setState({ leftOverSlides: 0 })
      }
    }

    const activeEnd = Math.min(
      visibleStart + slidesPerPage - this.store["leftOverSlides"],
      totalSlides
    )

    this.targetSlides = this.slidesArr.slice(visibleStart, activeEnd)
  }

  protected hasRemaining(totalSlides: number): boolean {
    return (
      !this.store[state.infinite] &&
      (totalSlides - this.store[state.slidesPerView]) %
        this.store[state.slidesPerPage] !==
        0
    )
  }

  /*private setRightBoundary() {
    const { isMissing } = this.getMissingSlides()
    const { infinite, slidesPerView, slideIndex, numberOfSlides } = this.store

    if (infinite) {
      if (slideIndex > numberOfSlides - 1)
        this.handleInfiniteBoundary(isMissing)
    } else {
      this.handleNonInfiniteBoundary(slidesPerView)
    }
  }*/

  protected getAdjustedStartIndex(currentIndex: number): number {
    const totalSlides = this.slidesArr.length
    const {
      slidesPerView,
      currentSlideMovement: direction,
      leftOverSlides
    } = this.store

    if (leftOverSlides === 0) return currentIndex

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

  private handleInfiniteBoundary(isMissing: boolean) {}

  /*private handleNonInfiniteBoundary(slidesPerView: number) {
    const { currentSlideMovement: mov } = this.store
    const lastIndex = parseInt(
      this.getLastActiveSlide().lastActiveSlide.dataset.index as string,
      10
    )

    const filteredSlides = Array.from(this.slidesArr).filter(slide => {
      const index = parseInt(slide.getAttribute("data-index") as string, 10)
      return index > lastIndex
    })

    if (mov === "increment") {
      if (filteredSlides.length < slidesPerView) {
        this.isIncompleteGroup = true
        this.setState({ leftOverSlides: slidesPerView - filteredSlides.length })
      }
    }
  }*/

  private activeSlidesLoop(): number {
    const { spacing } = this.store
    let translate = 0

    this.setTargetSlides()

    this.forEachSlide(this.targetSlides, slide => {
      translate += slide.offsetWidth + spacing
    })

    return translate
  }

  /* protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const lastPageSlides = totalSlides % slidesPerPage || slidesPerPage
    const leftOver = Math.max(0, slidesPerView - lastPageSlides)

    return { isMissing: leftOver > 0, leftOver }
  }*/

  /* protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const lastPageSlides = totalSlides % slidesPerPage || slidesPerPage
    const leftOver = Math.max(0, slidesPerView - lastPageSlides)

    return { isMissing: leftOver > 0, leftOver }
  }*/

  protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length

    // Quantas páginas completas temos
    const fullPages = Math.floor(totalSlides / slidesPerPage)

    // Quantos slides começam na última página
    const lastPageStart = fullPages * slidesPerPage

    // Quantos slides ainda sobram depois disso
    const remainingSlides = totalSlides - lastPageStart

    // Ex: 9 por view, 5 por página, 14 total
    // => lastPageStart = 10, remainingSlides = 4, leftOver = 9 - 4 = 5
    const leftOver = Math.max(0, slidesPerView - remainingSlides)

    return {
      isMissing: leftOver > 0,
      leftOver
    }
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

/*
  private getLastIndex(): number {
    const { lastActiveSlide } = this.getLastActiveSlide()
    const lastIndex = this.slidesArr.indexOf(lastActiveSlide)

    return lastIndex
  }

*/
