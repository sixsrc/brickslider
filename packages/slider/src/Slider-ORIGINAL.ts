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
  removeClass,
  waitFor
} from "./helpers"
import { TypeTargetSlideParams } from "./types"

export class Slider extends BaseSlider {
  private animation: AnimationFrame
  public currentIndex: number
  protected slides: HTMLElement[]
  private validPositions: number[]
  private mutate: Mutate
  private observer: Observer

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.slides = getSliderNodeList($root)
    this.mutate = new Mutate($root)
    this.observer = new Observer($root)
    this.validPositions = []
  }

  private computeValidPositions(): number[] {
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)

    const positions: number[] = []
    for (let pos = 0; pos <= maxStartIndex; pos += step) positions.push(pos)
    if (!positions.includes(maxStartIndex)) positions.push(maxStartIndex)
    return positions
  }

  private getPositions(): number[] {
    const positions = this.computeValidPositions()
    this.validPositions = positions
    return positions
  }

  private nearestPosition(index: number, positions?: number[]): number {
    const arr =
      positions && positions.length
        ? positions
        : this.validPositions.length
          ? this.validPositions
          : this.computeValidPositions()
    if (!arr || arr.length === 0) return 0
    return arr.reduce(
      (prev, curr) =>
        Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev,
      arr[0]
    )
  }

  private resolveStartIndex(rawStart: number): number {
    const slideEl = this.slides[rawStart]
    if (!slideEl) return rawStart
    return parseInt(slideEl.dataset.index || "1", 10) - 1
  }

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
  }

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

    this.currentIndex = this.setIndexBased(params)

    this.nextAction()
  }

  public normalizeIndex(index: number): number {
    this.getPositions()
    return this.nearestPosition(index, this.validPositions)
  }

  private setIndexBased(params: TypeTargetSlideParams): number {
    const positions = [...new Set(this.getPositions())]

    let nextIndex = this.currentIndex

    if (params.from === "next") {
      const next = positions.find(vp => vp > this.currentIndex)
      if (next !== undefined) nextIndex = next
    } else if (params.from === "prev") {
      const prev = positions
        .slice()
        .reverse()
        .find(vp => vp < this.currentIndex)
      if (prev !== undefined) nextIndex = prev
    } else if (params.from === "dots" || params.from === "touchend") {
      if (params.touchIndex !== undefined) {
        const realIndex = this.resolveStartIndex(params.touchIndex)
        nextIndex = this.normalizeIndex(realIndex)
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

    if (startIndex < firstRealIndex) return totalGroups - 1
    if (startIndex > lastRealIndex) return 0
    return Math.floor(startIndex / (slidesPerPage || 1))
  }

  public defineDotIndex(): void {
    const { isPagedActive, slidesPerPage, slidesPerView } = this.store
    if (!isPagedActive) return
    const positions = this.getPositions()

    let rawStart =
      typeof this.store.slideIndex === "number"
        ? this.store.slideIndex
        : this.currentIndex
    const startIndex = this.resolveStartIndex(rawStart)

    let computedDot = positions.findIndex(pos => pos === startIndex)
    if (computedDot === -1) {
      for (let i = positions.length - 1; i >= 0; i--) {
        if (positions[i] <= startIndex) {
          computedDot = i
          break
        }
      }
    }
    computedDot = Math.max(0, Math.min(computedDot, positions.length - 1))
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
        this.setState({ activePage: selectedIndex })
      }
    })
  }

  nextAction() {
    const {
      infinite,
      activePage,
      currentSlideMovement: mov,
      numberOfPages,
      slidesPerView,
      slidesPerPage
    } = this.store

    if (infinite && mov === "increment" && activePage === numberOfPages - 1) {
      const dataIndex =
        this.slides.find(slide => hasClass(slide, CLASS_VALUES.ACTIVE))?.dataset
          .index || "1"

      const clonedSlide = this.slides.find(
        slide =>
          slide.dataset.index === dataIndex &&
          hasClass(slide, CLASS_VALUES.CLONED)
      )

      const slideNumber = Number(clonedSlide?.dataset.slideNumber)

      this.currentIndex = slideNumber - 1

      console.log(slideNumber - 1, "teste")

      this.setState({
        isJumpSlide: true
      })

      this.animationFrame()
      this.setState(this.mainState())
      this.updateDOM()
      this.updateSlider()

      waitFor(0, () => {
        this.setState({
          isJumpSlide: false
        })

        const index =
          slidesPerView < slidesPerPage
            ? this.currentIndex + slidesPerPage
            : this.getFirstIndex()

        this.currentIndex = this.getFirstIndex()

        this.animationFrame()
        this.setState(this.mainState())
        this.updateDOM()
        this.updateSlider()
      })

      return
    }
    console.log(this.currentIndex, activePage, "teste decrement")
    if (infinite && mov === "decrement" && activePage === 0) {
      this.currentIndex = this.getFirstClonedIndex()

      this.setState({
        isJumpSlide: true
      })

      this.animationFrame()
      this.setState(this.mainState())
      this.updateDOM()
      this.updateSlider()

      waitFor(0, () => {
        this.setState({
          isJumpSlide: false
        })
        this.currentIndex =
          this.getFirstIndex() + slidesPerPage * (numberOfPages - 1)

        this.animationFrame()
        this.setState(this.mainState())
        this.updateDOM()
        this.updateSlider()
      })

      return
    }

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
            let visibleIndexes = this.observer?.getVisibleSlideIndexes() || []

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
  }

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
