import { State, type StateType } from "./State"
import { ANIMATION_OPTIONS, ATTRIBUTES, CLASS_VALUES } from "./constants"
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
  protected prevSlides: HTMLElement[]
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
    this.previousTranslate = 0
    this.dotIndex = 0
    this.lastIndex = 0
    this.slidesArrBoundary = false
  }

  public static getSlides($root: string, cloned?: boolean) {
    return getSliderNodeList($root, cloned)
  }

  protected defineEventTarget(event: MouseEventOrTouchEvent) {
    const clientX = getEventType(event).clientX
    const clientY = getEventType(event).clientY
    return { clientX, clientY }
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
    return animateElement(element, keyFrames, options)
  }

  protected calcTranslate(): number {
    this.translate = this.getSlidesSizes() as number
    return this.translate
  }

  private getLastActiveSlide() {
    const { activePage, slidesPerPage } = this.store
    const start = activePage * slidesPerPage
    const end = start + slidesPerPage
    return { lastActiveSlide: this.slidesArr[end - 1] }
  }

  private getLeftClonesCount(): number {
    const { infinite } = this.store
    const firstRealIndex = this.slidesArr.findIndex(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    if (!infinite) return 0

    return firstRealIndex >= 0 ? firstRealIndex : 0
  }

  private calculateVisibleRange(start: number, leftClones: number) {
    const { infinite, slidesPerView } = this.store
    const totalSlides = this.slidesArr.length
    const rawEnd = start + slidesPerView
    let visibleStart = infinite ? start + leftClones : start
    let visibleEnd = rawEnd + (infinite ? leftClones : 0)

    if (visibleEnd > totalSlides) {
      visibleEnd = totalSlides
      visibleStart = Math.max(0, visibleEnd - slidesPerView)
    }
    return { visibleStart, visibleEnd }
  }

  private updateIncompleteGroup(
    filteredSlides: HTMLElement[],
    totalSlides: number
  ): void {
    const {
      currentSlideMovement: mov,
      infinite,
      slidesPerView,
      leftOverSlides,
      activePage,
      numberOfPages,
      slidesPerPage
    } = this.store

    if (!infinite) {
      if (mov === "increment") {
        if (
          filteredSlides.length < slidesPerView ||
          (activePage === numberOfPages - 1 &&
            filteredSlides.length > slidesPerPage)
        ) {
          const k = this.slidesOnLastPage()

          if (filteredSlides.length > k) {
            filteredSlides = filteredSlides.slice(
              Math.max(filteredSlides.length - k, 0)
            )
          }

          console.log("filtered slides", filteredSlides, k)

          this.isIncompleteGroup = true
          this.setState({
            leftOverSlides: slidesPerView - filteredSlides.length
          })
        }

        return
      }
    }

    if (this.isIncompleteGroup) this.isIncompleteGroup = false
    else this.setState({ leftOverSlides: 0 })
  }

  private adjustForLastPage(totalSlides: number) {
    const {
      infinite,
      activePage,
      numberOfPages,
      slidesPerPage,
      currentSlideMovement: mov
    } = this.store
    if (
      !infinite &&
      mov === "increment" &&
      activePage === numberOfPages - 1 &&
      this.hasRemaining(totalSlides)
    ) {
      if (this.prevSlides.length >= slidesPerPage) {
        console.log("teste", this.prevSlides)
        //this.prevSlides.splice(-Math.abs(1))
        const { leftOver } = this.getMissingSlides()
      }
    }
  }

  private buildTargetSlides(clonedIndex: number) {
    const { infinite, activePage, numberOfPages } = this.store

    if (infinite && clonedIndex !== -1 && activePage === numberOfPages - 1) {
      this.targetSlides =
        clonedIndex === this.prevSlides.length - 1
          ? this.prevSlides.slice(0, -1)
          : this.prevSlides.slice(0, clonedIndex)
      return
    }

    this.targetSlides = this.prevSlides
  }

  private setTargetSlides(): void {
    const { slidesPerPage, activePage, activeDataIndex } = this.store
    const totalSlides = this.slidesArr.length
    const leftClones = this.getLeftClonesCount()
    const start = activePage * slidesPerPage
    const { visibleStart } = this.calculateVisibleRange(start, leftClones)
    const lastSlide = this.targetSlides[this.targetSlides.length - 1]
    const filteredSlides = this.getFilteredSlides(
      this.slidesArr,
      activeDataIndex
    )

    this.lastIndex = lastSlide?.dataset.index
      ? parseInt(lastSlide.dataset.index, 10)
      : -1

    this.updateIncompleteGroup(filteredSlides, totalSlides)

    const activeEnd = Math.min(
      visibleStart + slidesPerPage - this.store["leftOverSlides"],
      totalSlides
    )
    this.prevSlides = this.slidesArr.slice(visibleStart, activeEnd)

    const clonedIndex = this.prevSlides.findIndex(
      slide =>
        slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    )

    this.adjustForLastPage(totalSlides)
    this.buildTargetSlides(clonedIndex)
  }

  protected hasRemaining(totalSlides: number): boolean {
    const { slidesPerView, slidesPerPage } = this.store
    return (totalSlides - slidesPerView) % slidesPerPage !== 0
  }

  private activeSlidesLoop(): number {
    const { spacing } = this.store
    let translate = 0

    this.setTargetSlides()
    this.forEachSlide(this.targetSlides, slide => {
      translate += slide.offsetWidth + spacing
    })

    console.log("translate", translate)

    return translate
  }

  protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const fullPages = Math.floor(totalSlides / slidesPerPage)
    const remainingSlides = totalSlides - fullPages * slidesPerPage
    const leftOver = Math.max(0, slidesPerView - remainingSlides)

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
    return [{ transform: translate3d(translate ?? currentTranslate) }]
  }

  protected slidesOnLastPage() {
    const totalSlides = this.slidesArr.length
    const { slidesPerPage, slidesPerView } = this.store
    const totalPages =
      Math.ceil((totalSlides - slidesPerView) / slidesPerPage) + 1
    const startIndex = (totalPages - 1) * slidesPerPage

    if (totalSlides === 0) return 0

    return Math.min(slidesPerView, totalSlides - startIndex)
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  protected getFilteredSlides(slides: HTMLElement[], activeDataIndex: number) {
    return slides.filter(slide => {
      const index = parseInt(
        slide.getAttribute(ATTRIBUTES.DATA_NUMBER) as string,
        10
      )
      return index > activeDataIndex
    })
  }

  protected getDataIndex(slide: HTMLElement): string {
    const dataIndex = slide.dataset.index

    return dataIndex ? dataIndex : "0"
  }
}
