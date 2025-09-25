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
  public updateCurrentIndexFromTranslate(): void {
    const spacing = this.store.spacing || 0
    let remaining = -this.store.currentTranslate // translate positivo = distância percorrida
    let idx = 0

    for (let i = 0; i < this.slides.length; i++) {
      const w = this.slides[i].offsetWidth + spacing
      if (remaining < w) {
        idx = i
        break
      }
      remaining -= w
    }

    this.currentIndex = idx
    console.log(
      "[updateCurrentIndexFromTranslate] currentIndex:",
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

    // retorna sem o spacing final (safeTranslate no BaseSlider aplicará limite)
    return translate
  }

  public setSlideTarget(params: TypeTargetSlideParams) {
    // garante que currentIndex reflita o translate atual antes de decidir bloqueios/next
    this.updateCurrentIndexFromTranslate()

    const { numberOfPages } = this.store

    console.log(
      "[Slider.setSlideTarget] params:",
      params,
      "currentIndex:",
      this.currentIndex
    )

    // BLOQUEIO com base na posição real detectada
    // calcula último índice possível baseado em slidesPerPage
    const lastPossibleIndex = this.slides.length - this.store.slidesPerPage

    if (params.from === "next" && this.currentIndex > lastPossibleIndex) {
      console.log("[Slider.setSlideTarget] limite atingido, ignorando ação")
      return
    }

    if (params.from === "prev" && this.currentIndex < 0) {
      console.log("[Slider.setSlideTarget] limite atingido, ignorando ação")
      return
    }

    // recalcula índice final (this.currentIndex será atualizado)
    this.setIndexBased(params)
    console.log(
      "[Slider.setSlideTarget] after setIndexBased, currentIndex:",
      this.currentIndex
    )

    // if (!this.mapSlideIndex())
    this.nextAction()
  }

  /**
   * Ajusta currentIndex adequado:
   * - next/prev avançam por slidesPerPage (páginas),
   * - dots/touchend usam touchIndex quando recebido (já deve ser start-index).
   */
  /*private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType, slidesPerPage } = this.store
    const from = currentEventType as CurrentEventType
    let nextIndex = slideIndex ?? 0
    const totalSlides = this.slides.length
    const step = slidesPerPage || 1
    const maxStartIndex = Math.max(totalSlides - step, 0)

    if (from === "next") {
      nextIndex = this.currentIndex + step
    } else if (from === "prev") {
      nextIndex = this.currentIndex - step
    } else if (from === "dots" || from === "touchend") {
      if (params.touchIndex !== undefined) {
        nextIndex = params.touchIndex
      } else {
        nextIndex = this.currentIndex
      }
    }

    // clamp
    if (nextIndex < 0) nextIndex = infinite ? maxStartIndex : 0
    if (nextIndex > maxStartIndex) nextIndex = infinite ? 0 : maxStartIndex

    this.currentIndex = nextIndex
    console.log("[Slider.setIndexBased] resolved index:", this.currentIndex)
  }*/
  private setIndexBased(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite, currentEventType, slidesPerPage } = this.store
    const from = currentEventType as CurrentEventType
    let nextIndex = slideIndex ?? 0
    const totalSlides = this.slides.length
    const step = slidesPerPage || 1
    const maxStartIndex = Math.max(totalSlides - step, 0)

    // CALCULA posições válidas incluindo última posição para grupos incompletos
    const validPositions = []
    for (let i = 0; i < totalSlides; i += step) {
      validPositions.push(i)
    }

    // Se a última posição calculada não alcança o maxStartIndex, adiciona
    const lastCalculated = validPositions[validPositions.length - 1]
    if (lastCalculated < maxStartIndex) {
      validPositions.push(maxStartIndex)
    }

    console.log(
      `Total slides: ${totalSlides}, Step: ${step}, MaxStart: ${maxStartIndex}`
    )

    if (from === "next") {
      // Para next, encontra a próxima posição válida
      const currentValidIndex = validPositions.findIndex(
        pos => pos > this.currentIndex
      )

      if (currentValidIndex !== -1) {
        nextIndex = validPositions[currentValidIndex]
      } else {
        // Chegou no final
        nextIndex = infinite ? validPositions[0] : this.currentIndex // Mantém posição atual
      }
    } else if (from === "prev") {
      // Para prev, encontra a posição anterior válida
      let currentValidIndex = -1
      for (let i = validPositions.length - 1; i >= 0; i--) {
        if (validPositions[i] < this.currentIndex) {
          currentValidIndex = i
          break
        }
      }

      if (currentValidIndex !== -1) {
        nextIndex = validPositions[currentValidIndex]
      } else {
        nextIndex = infinite ? validPositions[validPositions.length - 1] : 0
      }
    } else if (from === "dots" || from === "touchend") {
      if (params.touchIndex !== undefined) {
        nextIndex = params.touchIndex
      } else {
        nextIndex = this.currentIndex
      }
    }

    // clamp final
    if (nextIndex < 0) nextIndex = infinite ? maxStartIndex : 0
    if (nextIndex > maxStartIndex) nextIndex = infinite ? 0 : maxStartIndex

    this.currentIndex = nextIndex
    console.log(
      "[Slider.setIndexBased] resolved index:",
      this.currentIndex,
      "valid positions:",
      validPositions
    )
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
    const safe = this.safeTranslate(translate) // use safeTranslate do BaseSlider para limitar
    console.log("translate", this.store.currentTranslate, -safe)
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

  /**
   * Recalculamos dotIndex A PARTIR do slideStartIndex (slideIndex) — assim nunca
   * ficamos dependentes de incrementos acumulados.
   */

  /* public defineDotIndex(): void {
    const { isPagedActive } = this.store
    if (!isPagedActive) return

    const slidesPerPage = this.store.slidesPerPage || 1
    // priorize slideIndex do store (que é o start-index), fallback para this.currentIndex
    const startIndex =
      typeof this.store.slideIndex === "number"
        ? this.store.slideIndex
        : this.currentIndex
    let computedDot = Math.floor(startIndex / slidesPerPage)

    // trata casos infinitos simples: se estamos no início, exibir último dot etc.
    computedDot = this.mapDotIndexForInfinite(computedDot, startIndex)

    console.log(
      "[defineDotIndex] startIndex:",
      startIndex,
      "computedDot:",
      computedDot
    )
    this.setState({ dotIndex: computedDot })
  }*/

  public defineDotIndex(): void {
    const { isPagedActive, slidesPerPage } = this.store
    if (!isPagedActive) return

    const step = slidesPerPage || 1
    const totalSlides = this.slides.length
    const maxStartIndex = Math.max(totalSlides - step, 0)

    // Calcula as posições válidas (mesmo cálculo do setIndexBased)
    const validPositions = []
    for (let i = 0; i < totalSlides; i += step) {
      validPositions.push(i)
    }

    const lastCalculated = validPositions[validPositions.length - 1]
    if (lastCalculated < maxStartIndex) {
      validPositions.push(maxStartIndex)
    }

    const startIndex =
      typeof this.store.slideIndex === "number"
        ? this.store.slideIndex
        : this.currentIndex

    // Encontra qual dot corresponde à posição atual
    let computedDot = validPositions.findIndex(pos => pos === startIndex)

    // Se não encontrou exata, encontra a posição mais próxima
    if (computedDot === -1) {
      computedDot = validPositions.findIndex(pos => pos >= startIndex)
      if (computedDot > 0) computedDot -= 1
    }

    // Garante que não saia dos limites
    computedDot = Math.max(0, Math.min(computedDot, validPositions.length - 1))

    computedDot = this.mapDotIndexForInfinite(computedDot, startIndex)

    console.log(
      "[defineDotIndex] startIndex:",
      startIndex,
      "validPositions:",
      validPositions,
      "computedDot:",
      computedDot
    )
    this.setState({ dotIndex: computedDot })
  }

  private mapDotIndexForInfinite(dotIndex: number, startIndex: number): number {
    const { infinite, numberOfPages } = this.store
    if (!infinite) return dotIndex

    // ajustes simples para infinite (se necessário)
    // se startIndex for 0, exibimos última página visualmente
    if (startIndex === 0) return Math.max(numberOfPages - 1, 0)

    // se startIndex está na última janela, mostramos a primeira página
    const slidesPerPage = this.store.slidesPerPage || 1
    if (startIndex >= this.slides.length - slidesPerPage) return 0

    return dotIndex
  }

  private reorderActiveDot(dotIndex: number) {
    // mantive para compatibilidade, mas agora defineDotIndex já faz o cálculo correto
    this.setState({ dotIndex })
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
