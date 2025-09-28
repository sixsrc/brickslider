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
  public currentIndex: number
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

  /** Sincroniza this.currentIndex a partir do translate atual (store.currentTranslate) */
  /* public updateCurrentIndexFromTranslate(): void {
    const spacing = this.store.spacing || 0
    let remaining = -this.store.currentTranslate
    let idx = 0

    for (let i = 0; i < this.slides.length; i++) {
      const w = this.slides[i].offsetWidth + spacing
      if (remaining < w) {
        idx = i
        break
      }
      remaining -= w
    }

    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)

    const validPositions: number[] = []
    let pos = 0
    while (pos <= maxStartIndex) {
      validPositions.push(pos)
      pos += step
    }
    if (!validPositions.includes(maxStartIndex))
      validPositions.push(maxStartIndex)

    // snap para posição válida mais próxima
    let nearest = validPositions[0]
    for (const vp of validPositions) {
      if (Math.abs(vp - idx) < Math.abs(nearest - idx)) {
        nearest = vp
      }
    }

    this.currentIndex = nearest
    console.log(
      "[updateCurrentIndexFromTranslate] idx cru:",
      idx,
      "ajustado para válido:",
      this.currentIndex
    )
  }*/

  public updateCurrentIndexFromTranslate(): void {
    const spacing = this.store.spacing || 0
    let remaining = -this.store.currentTranslate
    let idx = 0

    for (let i = 0; i < this.slides.length; i++) {
      const w = this.slides[i].offsetWidth + spacing
      if (remaining < w) {
        idx = i
        break
      }
      remaining -= w
    }

    // pega o índice lógico (real), mesmo que esteja em clone
    const realIndex = parseInt(this.slides[idx]?.dataset.index || "1", 10) - 1

    this.currentIndex = this.normalizeIndex(realIndex)

    console.log(
      "[updateCurrentIndexFromTranslate] idx cru:",
      idx,
      "realIndex:",
      realIndex,
      "ajustado para válido:",
      this.currentIndex
    )
  }

  /** Calcula translate (soma de larguras + spacing) para um índice qualquer. */
  public calcTranslateForIndex(index: number): number {
    const spacing = this.store.spacing || 0
    let translate = 0

    for (let i = 0; i < index; i++) {
      const slide = this.slides[i]
      if (slide) translate += slide.offsetWidth + spacing
    }

    return translate
  }

  public setSlideTarget(params: TypeTargetSlideParams) {
    this.updateCurrentIndexFromTranslate()

    console.log(
      "[Slider.setSlideTarget] params:",
      params,
      "currentIndex:",
      this.currentIndex
    )

    // recalcula índice final e aplica
    this.currentIndex = this.setIndexBased(params)

    console.log(
      "[Slider.setSlideTarget] after setIndexBased, currentIndex:",
      this.currentIndex
    )

    this.nextAction()
  }

  public normalizeIndex(index: number): number {
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)

    const validPositions: number[] = []
    let pos = 0
    while (pos <= maxStartIndex) {
      validPositions.push(pos)
      pos += step
    }
    if (!validPositions.includes(maxStartIndex))
      validPositions.push(maxStartIndex)

    // snap para posição válida mais próxima
    return validPositions.reduce((prev, curr) => {
      return Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev
    }, validPositions[0])
  }

  private setIndexBased(params: TypeTargetSlideParams): number {
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)

    const validPositions: number[] = []
    let pos = 0
    while (pos <= maxStartIndex) {
      validPositions.push(pos)
      pos += step
    }
    if (!validPositions.includes(maxStartIndex))
      validPositions.push(maxStartIndex)

    let nextIndex = this.currentIndex

    if (params.from === "next") {
      console.log("asdadadad91287981798379183", this.currentIndex)
      const next = validPositions.find(vp => vp > this.currentIndex)
      if (next !== undefined) nextIndex = next
    } else if (params.from === "prev") {
      const prev = [...validPositions]
        .reverse()
        .find(vp => vp < this.currentIndex)
      if (prev !== undefined) nextIndex = prev
    } else if (params.from === "dots" || params.from === "touchend") {
      if (params.touchIndex !== undefined) {
        /*nextIndex = validPositions.reduce((prev, curr) => {
          return Math.abs(curr - params.touchIndex!) <
            Math.abs(prev - params.touchIndex!)
            ? curr
            : prev
        }, validPositions[0])*/

        nextIndex = this.normalizeIndex(params.touchIndex)
      }
    }

    /* */

    return nextIndex
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

  private mainState(): Partial<StateType> {
    const translate = this.calcTranslateForIndex(this.currentIndex)
    const safe = this.safeTranslate(translate)
    console.log("translate", this.currentIndex)
    return {
      slideIndex: this.currentIndex,
      prevTranslate: -safe,
      currentTranslate: -safe
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
    const { isPagedActive, slidesPerPage, slidesPerView } = this.store
    if (!isPagedActive) return

    const step = slidesPerPage || 1
    const view = slidesPerView || 1
    const totalSlides = this.slides.length
    const maxStartIndex = Math.max(totalSlides - view, 0)

    const validPositions: number[] = []
    let pos = 0
    while (pos <= maxStartIndex) {
      validPositions.push(pos)
      pos += step
    }
    if (!validPositions.includes(maxStartIndex))
      validPositions.push(maxStartIndex)

    const startIndex =
      typeof this.store.slideIndex === "number"
        ? this.store.slideIndex
        : this.currentIndex

    let computedDot = validPositions.findIndex(pos => pos === startIndex)

    if (computedDot === -1) {
      for (let i = validPositions.length - 1; i >= 0; i--) {
        if (validPositions[i] <= startIndex) {
          computedDot = i
          break
        }
      }
    }

    computedDot = Math.max(0, Math.min(computedDot, validPositions.length - 1))

    computedDot = this.mapDotIndexForInfinite(computedDot, startIndex)

    this.setState({ dotIndex: computedDot })
  }

  /* private mapDotIndexForInfinite(dotIndex: number, startIndex: number): number {
    const { infinite, slidesPerPage } = this.store
    if (!infinite) return dotIndex

    // pegar apenas slides reais
    const realSlides = this.slides.filter(slide => !hasClass(slide, "cloned"))
    const maxIndex = realSlides.length - 1

    // se for antes do primeiro slide real
    if (startIndex <= 0) return 0

    // se for depois do último slide real
    if (startIndex >= maxIndex) return Math.floor(maxIndex / slidesPerPage)

    // mapear startIndex para dotIndex
    return Math.floor(startIndex / slidesPerPage)
  }*/

  private mapDotIndexForInfinite(dotIndex: number, startIndex: number): number {
    const { infinite, slidesPerPage } = this.store
    if (!infinite) return dotIndex

    const realSlides = this.slides.filter(slide => !hasClass(slide, "cloned"))
    const totalGroups = Math.ceil(realSlides.length / slidesPerPage)

    // pegar índice real via dataset
    const realIndex =
      parseInt(this.slides[startIndex]?.dataset.index || "1", 10) - 1

    // se está antes do primeiro real (clones iniciais) → última dot
    if (realIndex <= 0) return totalGroups - 1

    // se está depois do último real (clones finais) → primeira dot
    if (realIndex >= realSlides.length - 1) return 0

    // caso normal
    return Math.floor(realIndex / slidesPerPage)
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

    console.log("dotIndex", selectedIndex)

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
