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
  getSliderNodeList,
  hasClass
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
  isLastPage: boolean

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
    this.isLastPage = false
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
    const {
      slidesPerPage,
      activePage,
      activeDataIndex,
      slidesPerView,
      infinite,
      currentSlideMovement: mov,
      numberOfPages
    } = this.store
    const totalSlides = this.slidesArr.length
    let leftClones = 0

    if (infinite) {
      const firstRealIndex = this.slidesArr.findIndex(
        slide => !hasClass(slide, CLASS_VALUES.CLONED)
      )
      leftClones = firstRealIndex >= 0 ? firstRealIndex : 0
    }

    const start = activePage * slidesPerPage
    const rawEnd = start + slidesPerView
    let visibleStart = infinite ? start + leftClones : start
    let visibleEnd = rawEnd + (infinite ? leftClones : 0)
    let activeEnd = 0
    let clonedIndex = -1

    if (visibleEnd > totalSlides) {
      visibleEnd = totalSlides
      visibleStart = Math.max(0, visibleEnd - slidesPerView)
    }

    const lastSlide = this.targetSlides[this.targetSlides.length - 1]
    const lastIndexStr = lastSlide?.dataset.index
    const undef = undefined
    this.lastIndex = lastIndexStr !== undef ? parseInt(lastIndexStr, 10) : -1

    let filteredSlides = Array.from(this.slidesArr).filter(slide => {
      const index = parseInt(
        slide.getAttribute("data-slide-number") as string,
        10
      )

      return index > activeDataIndex
    })
    // let firstCloned = 0
    // firstCloned = filteredSlides.findIndex(
    // slide =>
    //   slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    //)

    /*if (infinite && firstCloned !== -1 && firstCloned > 0) {
      filteredSlides = filteredSlides.slice(0, slidesPerPage)

      if (firstCloned === filteredSlides.length - 1) {
        this.targetSlides = filteredSlides.slice(0, -1)
      } else {
        this.targetSlides = filteredSlides.slice(0, firstCloned)
      }
    }*/

    /*const filteredSlides = Array.from(this.slidesArr)
      .filter(slide => {
        const index = parseInt(
          slide.getAttribute("data-slide-number") as string,
          10
        )
        return index > activeDataIndex
      })
      .slice(0, slidesPerPage)*/

    if (infinite) {
      if (clonedIndex === this.prevSlides.length - 1) {
        this.targetSlides = this.prevSlides.slice(0, -1)
      } else {
        this.targetSlides = this.prevSlides.slice(0, clonedIndex)
      }
    }

    if (!infinite) {
      if (mov === "increment") {
        if (filteredSlides.length < slidesPerView) {
          this.isIncompleteGroup = true
          this.setState({
            leftOverSlides: slidesPerView - filteredSlides.length
          })
        }
      } else {
        if (this.isIncompleteGroup) {
          this.isIncompleteGroup = false
        } else {
          this.setState({ leftOverSlides: 0 })
        }
      }
    }
    activeEnd = Math.min(
      visibleStart + slidesPerPage - this.store["leftOverSlides"],
      totalSlides
    )

    this.prevSlides = this.slidesArr.slice(visibleStart, activeEnd)

    clonedIndex = this.prevSlides.findIndex(
      slide =>
        slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    )

    if (
      !infinite &&
      activePage === numberOfPages - 1 &&
      this.hasRemaining(totalSlides)
    ) {
      if (this.prevSlides.length >= slidesPerPage) {
        this.prevSlides.splice(-Math.abs(this.prevSlides.length - 1))
      }
    }

    if (infinite && clonedIndex !== -1 && activePage === numberOfPages - 1) {
      if (clonedIndex === this.prevSlides.length - 1) {
        this.targetSlides = this.prevSlides.slice(0, -1)
      } else {
        this.targetSlides = this.prevSlides.slice(0, clonedIndex)
      }
    } else {
      this.targetSlides = this.prevSlides
      console.log("darget", this.targetSlides)
    }
  }

  protected hasRemaining(totalSlides: number): boolean {
    const { slidesPerView, slidesPerPage, infinite } = this.store
    return (totalSlides - slidesPerView) % slidesPerPage !== 0
  }

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
    const fullPages = Math.floor(totalSlides / slidesPerPage)
    const lastPageStart = fullPages * slidesPerPage
    const remainingSlides = totalSlides - lastPageStart
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

    if (dataIndex) return dataIndex

    throw new Error("Data index not found on slide element.")
  }
}
