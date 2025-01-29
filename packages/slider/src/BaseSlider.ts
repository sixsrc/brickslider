import { State, StateType } from "./State"
import { ANIMATION_OPTIONS, CLASS_VALUES } from "./constants"
import {
  animateElement,
  calcTranslate,
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
  protected previousTranslate: number

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.activeSlides = getSliderNodeList($root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.getTrackChildren = getTrackChildren($root)
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.movement = false
    this.previousTranslate = 0
    this.dotIndex = 0
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

  protected calcTranslate(index: number): number {
    const { spacing } = this.store
    const { $children } = this

    return calcTranslate($children, spacing, index)
  }

  private getActiveSlides() {
    const activeSlides = this.activeSlides.filter(el =>
      hasClass(el, CLASS_VALUES.ACTIVE)
    )
    const lastActiveSlide = activeSlides.at(-1) || null
    const activeIndex = parseInt(lastActiveSlide?.dataset.index as string)

    return { lastActiveSlide, activeIndex }
  }

  /*private activeSlidesLoop(activeIndex: number) {
    const { slidesPerPage, spacing, currentSlideMovement:mov } = this.store
    const inc = mov === 'increment'

    let translate = 0
    let selectedSlides = null
    let slideWidth = 0
    let nextSlideIndex = 0

    for (let i = 0; i < slidesPerPage; i++) {
      nextSlideIndex = activeIndex + i

      selectedSlides = Array.from(this.activeSlides).find(
        slide => parseInt(slide.dataset.index as string) === nextSlideIndex
      )

      console.log("selectedSlides", nextSlideIndex)

      if (selectedSlides) {
        slideWidth = (selectedSlides.offsetWidth + spacing) as any
        translate += slideWidth
      }
    }

    return translate
  }*/

  //console.log(getSliderNodeList(this.$root).length)

  private activeSlidesLoop() {
    const {
      slidesPerPage,
      spacing,
      slideIndex,
      currentSlideMovement: mov
    } = this.store
    const isIncrement = mov === "increment"
    let translate = 0
    const slidesArray = Array.from(this.activeSlides)
    const activeSlides = slidesArray.filter(slide =>
      slide.classList.contains("active")
    )
    const lastActiveSlide = activeSlides[activeSlides.length - 1]
    const { isMissing: isMissingSlides, leftOverSlides } =
      this.getMissingSlides()
    const lastActiveIndex = slidesArray.indexOf(lastActiveSlide)
    let targetSlides: HTMLElement[]
    let isAtRightBoundary = false
    let isAtLeftBoundary = false

    if (!lastActiveSlide) return 0

    if (isIncrement) {
      targetSlides = slidesArray.slice(
        lastActiveIndex + 1,
        lastActiveIndex + 1 + slidesPerPage
      )
      const lastTargetIndex = slidesArray.indexOf(
        targetSlides[targetSlides.length - 1]
      )
      isAtRightBoundary = lastTargetIndex === slidesArray.length - 1

      console.log("target", targetSlides)

      if (isAtRightBoundary && isMissingSlides)
        targetSlides.splice(-1, leftOverSlides)
    } else {
      targetSlides = slidesArray.slice(
        Math.max(0, lastActiveIndex - slidesPerPage),
        lastActiveIndex
      )

      //targetSlides = slidesArray.slice(
      // Math.max(0, lastActiveIndex - slidesPerPage - 1),
      // lastActiveIndex - 1
      //)

      //const firstTargetIndex = slidesArray.indexOf(targetSlides[0])
      isAtLeftBoundary = slideIndex === 1

      if (isAtLeftBoundary && isMissingSlides)
        targetSlides.splice(-leftOverSlides)
      console.log("target", targetSlides)
    }

    targetSlides.forEach(slide => {
      translate += slide.offsetWidth + spacing
    })

    return translate
  }

  private getMissingSlides(): getMissingSlides {
    const { numberOfSlides, slidesPerPage } = this.store
    const remainder = numberOfSlides % slidesPerPage
    const totalSlides = getChildrenCount(this.$children)
    const leftOver = totalSlides % slidesPerPage
    console.log("sobrando", leftOver) // Resultado: 1

    // return remainder === 0 ? 0 : slidesPerPage - remainder

    return { isMissing: remainder, leftOverSlides: leftOver }
  }

  protected getSlidesSizes(): number | undefined {
    const { lastActiveSlide } = this.getActiveSlides()

    if (!lastActiveSlide) return

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
