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
  isSafariBrowser,
  removeClass
} from "./helpers"
import { TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: AnimationFrame
  public currentIndex: number
  private slides: HTMLElement[]
  mutate: Mutate
  observer: Observer
  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.slides = getSliderNodeList($root)
    this.mutate = new Mutate($root)
    this.observer = new Observer($root)
  }

  /** Sincroniza currentIndex a partir do translate */
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

    this.currentIndex = this.normalizeIndex(idx)
    console.log(
      "[updateCurrentIndexFromTranslate] idx cru:",
      idx,
      "ajustado para válido:",
      this.currentIndex
    )
  }

  /** Calcula translate para um índice qualquer */
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
    // PARA TOUCH INFINITE: não atualiza currentIndex pelo translate
    if (!(params.from === "touchend" && this.store.infinite)) {
    }

    this.updateCurrentIndexFromTranslate()

    console.log(
      "[Slider.setSlideTarget] params:",
      params,
      "currentIndex:",
      this.currentIndex
    )

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

    console.log("maxStartIndex:", this.slides.length - view)

    let pos = 0
    while (pos <= maxStartIndex) {
      validPositions.push(pos)
      pos += step
    }
    if (!validPositions.includes(maxStartIndex))
      validPositions.push(maxStartIndex)

    console.log(
      "918723917391873123",
      validPositions.reduce(
        (prev, curr) =>
          Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev,
        validPositions[0]
      )
    )

    return validPositions.reduce(
      (prev, curr) =>
        Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev,
      validPositions[0]
    )
  }

  /* private setIndexBased(params: TypeTargetSlideParams): number {
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
      const next = validPositions.find(vp => vp > this.currentIndex)
      if (next !== undefined) nextIndex = next
    } else if (params.from === "prev") {
      const prev = [...validPositions]
        .reverse()
        .find(vp => vp < this.currentIndex)
      if (prev !== undefined) nextIndex = prev
    } else if (params.from === "dots" || params.from === "touchend") {
      if (params.touchIndex !== undefined) {
        // converte touchIndex para índice real via dataset
        const slideEl = this.slides[params.touchIndex]
        let realIndex = params.touchIndex
        if (slideEl) {
          realIndex = parseInt(slideEl.dataset.index || "1", 10) - 1
        }
        nextIndex = this.normalizeIndex(realIndex)
      }
    }

    return nextIndex
  }*/

  private setIndexBased(params: TypeTargetSlideParams): number {
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)
    let validPositions: number[] = []
    let pos = 0
    while (pos <= maxStartIndex) {
      validPositions.push(pos)
      pos += step
    }
    if (!validPositions.includes(maxStartIndex))
      validPositions.push(maxStartIndex)

    let nextIndex = this.currentIndex

    // validPositions = [0, 5, 8, 11, 14, 17, 20, 23]

    console.log("valid positions", validPositions)

    if (params.from === "next") {
      const next = validPositions.find(vp => vp > this.currentIndex)
      if (next !== undefined) nextIndex = next
    } else if (params.from === "prev") {
      const prev = [...validPositions]
        .reverse()
        .find(vp => vp < this.currentIndex)
      if (prev !== undefined) nextIndex = prev
    } /*
    else if (params.from === "touchend" && this.store.infinite) {
      // TOUCH INFINITE: usamos o índice real do dataset
      if (params.touchIndex !== undefined) {
        const slideEl = this.slides[params.touchIndex]
        if (slideEl) {
          nextIndex = parseInt(slideEl.dataset.index || "0", 10) - 1
        } else {
          nextIndex = params.touchIndex
        }
      }
    }s
     */ else if (params.from === "dots" || params.from === "touchend") {
      // Dots ou touch normal
      if (params.touchIndex !== undefined) {
        const slideEl = this.slides[params.touchIndex]
        let realIndex = params.touchIndex
        if (slideEl) {
          realIndex = parseInt(slideEl.dataset.index || "1", 10) - 1
        }
        nextIndex = this.normalizeIndex(nextIndex)
      }
    }

    return nextIndex
  }

  private mapDotIndexForInfinite(dotIndex: number, startIndex: number): number {
    const { infinite, slidesPerPage } = this.store
    if (!infinite) return dotIndex

    const realSlides = this.slides.filter(slide => !hasClass(slide, "cloned"))
    const totalReal = realSlides.length
    const totalGroups = Math.ceil(totalReal / (slidesPerPage || 1))
    const firstRealIndex = parseInt(realSlides[0]?.dataset.index || "1", 10) - 1
    const lastRealIndex =
      parseInt(realSlides[realSlides.length - 1]?.dataset.index || "1", 10) - 1

    // clones à esquerda → último dot
    if (startIndex < firstRealIndex) return totalGroups - 1
    // clones à direita → primeiro dot
    if (startIndex > lastRealIndex) return 0
    // dentro do range real → dot normal
    return Math.floor(startIndex / (slidesPerPage || 1))
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

    let rawStart =
      typeof this.store.slideIndex === "number"
        ? this.store.slideIndex
        : this.currentIndex

    const slideEl = this.slides[rawStart]
    let startIndex = rawStart
    if (slideEl) {
      const dataIndex = parseInt(slideEl.dataset.index || "1", 10)
      startIndex = dataIndex - 1
    }

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

  public updateSlider() {
    this.defineDotIndex()
    this.updateDots(this.$root)
  }

  protected updateDOM(): void {}

  public updateDots($root: string) {
    const { dotIndex } = this.store
    const selectedIndex = dotIndex ?? 0
    const { dots: isDots } = this.store
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))
    if (!isDots) return

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)
      if (i === Math.abs(selectedIndex)) {
        addClass([dot], CLASS_VALUES.SELECTED)
        this.setState({ activePage: i + 1 })
      }
    })
  }

  nextAction() {
    this.animationFrame()
    this.setState(this.mainState())
    this.updateDOM()
    this.updateSlider()
  }

  private mainState(): Partial<StateType> {
    const translate = this.calcTranslateForIndex(this.currentIndex)
    const safe = this.safeTranslate(translate)
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

  /** Retorna o índice inicial baseado apenas nos clones à esquerda */
  public getInitialIndexFromClones(): number {
    let cloneCountLeft = 0
    const slides = Slider.getSlides(this.$root)

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      if (slide.classList.contains("cloned")) {
        cloneCountLeft++
      } else {
        break
      }
    }

    return cloneCountLeft
  }
}
