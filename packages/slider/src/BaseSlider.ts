import { State, type StateType } from "./State"
import { EventEmitter } from "./EventEmitter"
import { ANIMATION_OPTIONS, CLASS_VALUES, TIMES } from "./helpers"
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
  private static emitters = new Map<string, EventEmitter>()
  protected $root: string
  protected getRootSelector: HTMLElement | undefined
  protected state: State
  protected store: StateType
  protected emitter: EventEmitter
  protected $children: HTMLElement
  protected $track: HTMLElement
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected slidesArr: HTMLElement[]
  protected slides: HTMLElement[]
  protected translate: number
  movement: boolean

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.slidesArr = getSliderNodeList($root)
    this.slides = getSliderNodeList($root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.emitter = BaseSlider.getEmitter(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.$track = getTrackChildren($root) as HTMLElement
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.translate = 0
    this.movement = false
  }

  public static getSlides($root: string, cloned?: boolean) {
    return getSliderNodeList($root, cloned)
  }

  private static getEmitter($root: string): EventEmitter {
    const currentEmitter = BaseSlider.emitters.get($root)
    const emitter = new EventEmitter()

    BaseSlider.emitters.set($root, emitter)

    if (currentEmitter) return currentEmitter

    return emitter
  }

  public on(event: string, listener: (...args: any[]) => void): void {
    this.emitter.on(event, listener)
  }

  public off(event: string, listener: (...args: any[]) => void): void {
    this.emitter.off(event, listener)
  }

  protected emit(event: string, ...args: any[]): void {
    this.emitter.emit(event, ...args)
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
    const { dotIndex } = this.store
    let nextDotIndex: number | null = null

    if (dotIndex === -1) nextDotIndex = numberOfSlides - 1
    else if (dotIndex === numberOfSlides) nextDotIndex = 0

    if (nextDotIndex === null) return

    const dotState = { dotIndex: nextDotIndex }

    this.setState(dotState)
  }

  protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): Animation[] {
    return animateElement(element, keyFrames, options)
  }

  protected calcTranslateForIndex(index: number): number {
    const { gap: currentGap } = this.store
    const gap = currentGap || 0
    let translate = 0

    for (let i = 0; i < index; i++) {
      const slide = this.slidesArr[i]
      if (slide) translate += slide.offsetWidth + gap
    }

    return this.safeTranslate(translate)
  }

  protected calcTranslate(): number {
    const { slideIndex } = this.store
    const index = typeof slideIndex === "number" ? slideIndex : 0

    return this.calcTranslateForIndex(index)
  }

  protected safeTranslate(translate: number): number {
    const { sliderWidth } = this.store
    const containerWidth =
      sliderWidth ?? this.sliderWidth ?? getSliderWidth(this.$children) ?? 0

    this.sliderWidth = containerWidth
    let maxTranslate = this.getTotalWidth() - containerWidth

    if (translate > maxTranslate) return maxTranslate
    if (translate < 0) return 0

    return translate
  }

  protected getTotalWidth(): number {
    const { gap } = this.store

    if (this.slides.length === 0) return 0

    return this.slides.reduce((total, slide, index) => {
      return (
        total + slide.offsetWidth + (index < this.slides.length - 1 ? gap : 0)
      )
    }, 0)
  }

  protected getVisibleSlidesForHeight(startIndex?: number): HTMLElement[] {
    const { slidesPerView } = this.store
    const initialIndex =
      typeof startIndex === "number"
        ? startIndex
        : typeof this.store.slideIndex === "number"
          ? this.store.slideIndex
          : 0
    const safeSlidesPerView = Math.max(1, slidesPerView || 1)

    return this.slides.slice(initialIndex, initialIndex + safeSlidesPerView)
  }

  protected getMeasuredSlideHeight(slide: HTMLElement | undefined): number {
    if (!slide) return 0

    const firstChild = slide.firstElementChild as HTMLElement | null

    return Math.max(
      slide.offsetHeight,
      slide.scrollHeight,
      firstChild?.offsetHeight ?? 0,
      firstChild?.scrollHeight ?? 0
    )
  }

  protected getAutoHeightTarget(startIndex?: number): number {
    const visibleSlides = this.getVisibleSlidesForHeight(startIndex)
    const heights = visibleSlides.map(slide => this.getMeasuredSlideHeight(slide))

    return Math.max(0, ...heights)
  }

  protected syncAutoHeight(
    startIndex?: number,
    duration: number = TIMES.DEFAULT_TRANSITION_TIME
  ): void {
    const { useAutoHeight, isJumpSlide, currentEventType } = this.store
    const rootSelector = this.getRootSelector

    if (!useAutoHeight || !rootSelector || !this.$track) return

    const nextHeight = this.getAutoHeightTarget(startIndex)
    const currentTrackHeight = this.$track.offsetHeight
    const currentRootHeight = rootSelector.offsetHeight
    const safeDuration =
      isJumpSlide || currentEventType === "touchmove" ? 0 : duration
    const keyframes = [{ height: `${nextHeight}px` }]
    const animationOptions = this.options(safeDuration)

    if (nextHeight <= 0) return

    if (currentTrackHeight !== nextHeight) {
      this.animate(this.$track, keyframes, animationOptions)
    }

    if (currentRootHeight !== nextHeight) {
      this.animate(rootSelector, keyframes, animationOptions)
    }
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

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  protected getFirstIndex(): number {
    return this.slides.findIndex(slide => slide.dataset.index === "1")
  }

  protected getDataSlideNumber(dataNumber: string): number {
    return this.slides.findIndex(
      slide =>
        slide.dataset.slideNumber === dataNumber &&
        !hasClass(slide, CLASS_VALUES.CLONED)
    )
  }

  protected getDataIndex(dataNumber: string): number {
    return Number(
      this.slides.find(
        slide =>
          slide.dataset.slideNumber === dataNumber &&
          !hasClass(slide, CLASS_VALUES.CLONED)
      )?.dataset.index ?? -1
    )
  }

  protected getClonePreviousPosition(dataNumber: string): number {
    const dataIndex = this.getDataIndex(dataNumber)

    const clonedSlide = this.slides.find(
      slide =>
        slide.dataset.index === String(dataIndex) &&
        hasClass(slide, CLASS_VALUES.CLONED)
    )

    return Number(clonedSlide?.dataset.slideNumber) - 1
  }

  protected getFirstClonedIndex(): number {
    return this.slides.findIndex(
      slide =>
        slide.dataset.index === "1" && hasClass(slide, CLASS_VALUES.CLONED)
    )
  }

  protected getLastGroupStep(
    totalSlides: number,
    slidesPerView: number,
    slidesPerPage: number
  ): number {
    const step = slidesPerPage
    const maxStartIndex = Math.max(totalSlides - slidesPerView, 0)
    const fullPages = Math.floor(maxStartIndex / step) * step
    const lastGroupStep = maxStartIndex - fullPages

    return lastGroupStep > 0 ? lastGroupStep : step
  }

  protected hasRemaining(totalSlides: number): boolean {
    const { slidesPerView, slidesPerPage } = this.store

    return (totalSlides - slidesPerView) % slidesPerPage !== 0
  }

  protected isAlign(totalSlides: number, slidesPerPage: number) {
    return totalSlides % slidesPerPage === 0
  }

  protected getMissingSlides(): { isMissing: boolean; leftOver: number } {
    const { slidesPerPage, slidesPerView } = this.store
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const fullPages = Math.floor(totalSlides / slidesPerPage)
    const remainingSlides = totalSlides - fullPages * slidesPerPage
    const leftOver = Math.max(0, slidesPerView - remainingSlides)

    return { isMissing: leftOver > 0, leftOver }
  }
}
