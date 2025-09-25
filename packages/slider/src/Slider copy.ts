import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"
import { Observer } from "./Observer"

import { StateType } from "./State"
import { CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  isNotMapped,
  isSafariBrowser,
  removeClass
} from "./helpers"
import { CurrentEventType, TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: AnimationFrame
  private currentIndex: number
  private slides: HTMLElement[]
  mutate: Mutate
  static slides: any
  private targetDataIndex: null | string
  observer: Observer

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.targetDataIndex = null
    this.slides = getSliderNodeList($root)
    this.mutate = new Mutate($root)
    this.observer = new Observer($root)
  }

  public setSlideTarget(params: TypeTargetSlideParams) {
    const { numberOfPages } = this.store

    console.log(
      "[Slider.setSlideTarget] params:",
      params,
      "currentIndex:",
      this.currentIndex
    )

    // 🔒 BLOQUEIO ANTES de recalcular o índice
    if (
      (params.from === "next" && this.currentIndex >= numberOfPages - 1) ||
      (params.from === "prev" && this.currentIndex <= 0)
    ) {
      console.log("[Slider.setSlideTarget] limite atingido, ignorando ação")
      return
    }

    // só executa se passou no bloqueio
    this.setIndexBased(params)
    console.log(
      "[Slider.setSlideTarget] after setIndexBased, currentIndex:",
      this.currentIndex
    )

    if (!this.mapSlideIndex()) this.nextAction()
  }

  /* private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType, numberOfSlides } =
      this.store
    const from = currentEventType as CurrentEventType
    let nextIndex = slideIndex

    if (from === "next") {
      nextIndex = slideIndex + 1
    } else if (from === "prev") {
      nextIndex = slideIndex - 1
    } else if (from === "dots" || from === "touchend") {
      if (params.touchIndex !== undefined) {
        nextIndex = params.touchIndex
        if (infinite && from === "dots") {
          nextIndex = nextIndex + 1
        }
      }
    }

    // 🔒 garantir que não sai dos limites
    if (nextIndex < 0) {
      nextIndex = infinite ? numberOfSlides - 1 : 0
    } else if (nextIndex > numberOfSlides - 1) {
      nextIndex = infinite ? 0 : numberOfSlides - 1
    }

    this.currentIndex = nextIndex
    console.log("[Slider.setIndexBased] resolved index:", this.currentIndex)
  }
*/

  private setIndexBased(params: TypeTargetSlideParams): void {
    const {
      slideIndex,
      infinite,
      numberOfPages,
      currentEventType,
      slidesPerPage
    } = this.store
    const from = currentEventType as CurrentEventType
    let nextIndex = slideIndex

    const totalSlides = this.slides.length

    if (from === "next") {
      nextIndex = slideIndex + 1
    } else if (from === "prev") {
      nextIndex = slideIndex - 1
    } else if (from === "dots" || from === "touchend") {
      if (params.touchIndex !== undefined) {
        nextIndex = params.touchIndex
        if (infinite && from === "dots") {
          //nextIndex += slidesPerPage
        }
      }
    }

    // 🔒 garantir que não sai dos limites
    if (nextIndex < 0) {
      nextIndex = infinite ? Math.max(numberOfPages - slidesPerPage, 0) : 0
    } else if (nextIndex > numberOfPages - 1) {
      nextIndex = infinite ? 0 : numberOfPages - 1
    }

    this.currentIndex = nextIndex
    console.log("[Slider.setIndexBased] resolved index:", this.currentIndex)
  }

  public mapSlideIndex(): boolean {
    const { infinite, numberOfSlides } = this.store
    return isNotMapped(infinite, this.currentIndex, numberOfSlides)
  }

  nextAction() {
    this.animationFrame()
    this.setState(this.mainState())
    console.log("slideIndex", this.store.slideIndex)
    this.updateDOM()
    this.updateSlider()
  }

  /** 🔑 calcTranslate robusto baseado em currentIndex */

  /*public calcTranslate(): number {
    let translate = 0
    for (let i = 0; i < this.currentIndex; i++) {
      const slide = this.slides[i]
      if (slide) {
        translate += slide.offsetWidth
      }
    }
    return translate
  }*/

  private mainState(): Partial<StateType> {
    const translate = this.calcTranslate()

    console.log("translate", this.store.currentTranslate, -translate)
    return {
      slideIndex: this.currentIndex,
      prevTranslate: -translate,
      currentTranslate: -translate
    }
  }

  private animationFrame() {
    const { slidesPerPage } = this.store
    let intervalId: number | null = null

    this.animation
      .init({
        onStart: () => {
          intervalId = window.setInterval(() => {
            const visibleIndexes = this.observer?.getVisibleSlideIndexes() || []
            this.mutate.updateActiveSlides(visibleIndexes, slidesPerPage)
          }, 10)
        },
        onEnd: () => {
          if (intervalId !== null) {
            clearInterval(intervalId)
            intervalId = null
          }
        }
      })
      .then(() => {})

    requestAnimationFrame(() => {
      const time = isSafariBrowser() ? 10 : 0
      this.animation.init().then(() => {})
    })
  }

  public defineDotIndex(): void {
    const {
      currentSlideMovement: mov,
      isPagedActive,
      currentEventType
    } = this.store

    if (mov && isPagedActive) {
      const { dotIndex } = this.defineIncrementOrDecrement()
      this.reorderActiveDot(dotIndex)
    }
  }

  private reorderActiveDot(dotIndex: number) {
    const { slideIndex, infinite } = this.store
    dotIndex = this.mapDotIndex().get(`${infinite}-${slideIndex}`) ?? dotIndex
    this.setState({ dotIndex })
  }

  private mapDotIndex(): Map<string, number | undefined> {
    const { slideIndex, numberOfSlides, infinite } = this.store
    const dotIndexMap = new Map<string, number | undefined>([
      [`true-0`, infinite ? numberOfSlides - 1 : 0],
      [`true-${numberOfSlides + 1}`, infinite ? 0 : undefined],
      [`false-${numberOfSlides - 1}`, slideIndex]
    ])
    return dotIndexMap
  }

  protected defineIncrementOrDecrement() {
    let { currentSlideMovement: mov, dotIndex, numberOfPages } = this.store

    if (mov === "increment") dotIndex++
    else dotIndex--

    if (dotIndex === -1) dotIndex = numberOfPages - 1
    else if (dotIndex > numberOfPages - 1) dotIndex = 0

    return { dotIndex }
  }

  public updateSlider() {
    this.defineDotIndex()
    this.updateDots(this.$root)
  }

  protected updateDOM(): void {}

  public updateDots($root: string) {
    const { dotIndex } = this.store
    let selectedIndex = dotIndex ?? 0
    const { dots: isDots } = this.store
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))

    if (!isDots) return {}

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === Math.abs(selectedIndex)) {
        addClass([dot], CLASS_VALUES.SELECTED)
        this.setState({ activePage: i + 1 })
        console.log("activePage", this.store.activePage)
      }
    })
  }
}
