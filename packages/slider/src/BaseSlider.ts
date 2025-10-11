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
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected slidesArr: HTMLElement[]
  protected targetSlides: HTMLElement[]
  protected translate: number
  movement: boolean

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.slidesArr = getSliderNodeList($root)
    this.targetSlides = []
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
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
    if (this.store.dotIndex === -1) this.store.dotIndex = numberOfSlides - 1
    else if (this.store.dotIndex === numberOfSlides) this.store.dotIndex = 0
  }

  protected animate(
    element: HTMLElement,
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): Animation[] {
    return animateElement(element, keyFrames, options)
  }

  /**
   * Calcula o translate somando larguras dos slides até `index`.
   * Usa safeTranslate para limitar por máximo.
   */
  protected calcTranslateForIndex(index: number): number {
    const spacing = this.store.spacing || 0
    let translate = 0

    for (let i = 0; i < index; i++) {
      const slide = this.slidesArr[i]
      if (slide) translate += slide.offsetWidth + spacing
    }

    // remove spacing extra se existiu soma
    return this.safeTranslate(translate)
  }

  /**
   * Compatibilidade: calcTranslate sem parâmetro usa o slideIndex do store.
   * Isso garante que TouchEnd e outras classes que chamam calcTranslate() obtenham
   * o mesmo resultado que a navegação por setSlideTarget().
   */
  protected calcTranslate(): number {
    const index =
      typeof this.store.slideIndex === "number" ? this.store.slideIndex : 0
    return this.calcTranslateForIndex(index)
  }

  protected safeTranslate(translate: number): number {
    const containerWidth = this.sliderWidth || 0
    let maxTranslate = this.getTotalWidth() - containerWidth

    if (translate > maxTranslate) {
      // limita e devolve o máximo
      return maxTranslate
    }

    if (translate < 0) {
      return 0
    }

    return translate
  }

  protected getTotalWidth(): number {
    const { spacing, infinite } = this.store
    if (this.slidesArr.length === 0) return 0

    console.log("Total Width:", this.slidesArr)

    return this.slidesArr.reduce((total, slide, index) => {
      return (
        total +
        slide.offsetWidth +
        (index < this.slidesArr.length - 1 ? spacing : 0)
      )
    }, 0)
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

  protected getFirstClonedIndex(): number {
    // usado por algumas funcionalidades de clone/infinite
    return this.targetSlides.findIndex(
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

    // índice do início da penúltima página
    const fullPages = Math.floor(maxStartIndex / step) * step

    // quantos slides vão rolar do início da penúltima página até o final
    const lastGroupStep = maxStartIndex - fullPages
    return lastGroupStep > 0 ? lastGroupStep : step
  }

  protected hasRemaining(totalSlides: number): boolean {
    const { slidesPerView, slidesPerPage } = this.store

    return (totalSlides - slidesPerView) % slidesPerPage !== 0
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
