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

  public updateCurrentIndexFromTranslate(): void {
    const { spacing } = this.store || 0
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
  }

  public calcTranslateForIndex(index: number): number {
    const { spacing } = this.store || 0
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
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)
    let pos = 0

    while (pos <= maxStartIndex) {
      this.validPositions.push(pos)
      pos += step
    }

    if (!this.validPositions.includes(maxStartIndex))
      this.validPositions.push(maxStartIndex)

    return this.validPositions.reduce(
      (prev, curr) =>
        Math.abs(curr - index) < Math.abs(prev - index) ? curr : prev,
      this.validPositions[0]
    )
  }

  private buildValidPositions(): number[] {
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)
    const positions: number[] = []

    for (let pos = 0; pos <= maxStartIndex; pos += step) {
      positions.push(pos)
    }

    if (!positions.includes(maxStartIndex)) {
      positions.push(maxStartIndex)
    }

    return [...new Set(positions)]
  }

  private getNextIndex(): number {
    return (
      this.validPositions.find(position => position > this.currentIndex) ??
      this.currentIndex
    )
  }

  private getPrevIndex(): number {
    return (
      [...this.validPositions]
        .reverse()
        .find(position => position < this.currentIndex) ?? this.currentIndex
    )
  }

  private getTouchIndex(params: TypeTargetSlideParams): number {
    if (params.touchIndex === undefined) return this.currentIndex

    const slide = this.slides[params.touchIndex]

    if (!slide) return params.touchIndex

    const realIndex = Number(slide.dataset.index || "1") - 1

    return this.normalizeIndex(realIndex)
  }

  private indexActions(params: TypeTargetSlideParams) {
    return {
      next: () => this.getNextIndex(),
      prev: () => this.getPrevIndex(),
      dots: () => this.getTouchIndex(params),
      touchend: () => this.getTouchIndex(params)
    }
  }

  private setIndexBased(params: TypeTargetSlideParams): number {
    this.validPositions = this.buildValidPositions()

    const actions = this.indexActions(params)

    return actions[params.from as keyof typeof actions]?.() ?? this.currentIndex
  }

  private mapDotIndexForInfinite(dotIndex: number, startIndex: number): number {
    const { infinite, slidesPerPage } = this.store
    const realSlides = this.slides.filter(slide => !hasClass(slide, "cloned"))
    const totalReal = realSlides.length
    const totalGroups = Math.ceil(totalReal / (slidesPerPage || 1))
    const firstRealIndex = parseInt(realSlides[0]?.dataset.index || "1", 10) - 1
    const slideIdx = realSlides[realSlides.length - 1]
    const lastIdx = parseInt(slideIdx?.dataset.index || "1", 10) - 1

    if (!infinite) return dotIndex
    if (startIndex < firstRealIndex) return totalGroups - 1
    if (startIndex > lastIdx) return 0
    return Math.floor(startIndex / (slidesPerPage || 1))
  }

  private getRawStartIndex(): number {
    return typeof this.store.slideIndex === "number"
      ? this.store.slideIndex
      : this.currentIndex
  }

  private getStartIndexFromSlide(rawStart: number): number {
    const slide = this.slides[rawStart]

    if (!slide) return rawStart

    return Number(slide.dataset.index || "1") - 1
  }

  private getDotFromStartIndex(startIndex: number): number {
    const exactDot = this.validPositions.findIndex(
      position => position === startIndex
    )

    if (exactDot !== -1) return exactDot

    for (let i = this.validPositions.length - 1; i >= 0; i--) {
      if (this.validPositions[i] <= startIndex) {
        return i
      }
    }

    return 0
  }

  private clampDotIndex(dotIndex: number): number {
    return Math.max(0, Math.min(dotIndex, this.validPositions.length - 1))
  }

  public defineDotIndex(): void {
    const { isPagedActive } = this.store
    const rawStart = this.getRawStartIndex()
    const startIndex = this.getStartIndexFromSlide(rawStart)
    const computedDot = this.mapDotIndexForInfinite(
      this.clampDotIndex(this.getDotFromStartIndex(startIndex)),
      startIndex
    )

    if (!isPagedActive) return

    this.validPositions = this.buildValidPositions()

    this.setState({ dotIndex: computedDot })
  }

  public updateSlider() {
    this.defineDotIndex()
    this.updateDots(this.$root)
  }

  protected updateDOM(): void {}

  public updateDots($root: string) {
    const { dotIndex, dots: isDots } = this.store
    const selectedIndex = dotIndex ?? 0
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

  private commit() {
    this.animationFrame()
    this.setState(this.mainState())
    this.updateDOM()
    this.updateSlider()
  }

  private jump(from: number, to: number) {
    this.setState({ isJumpSlide: true })
    this.currentIndex = from
    this.commit()

    waitFor(0, () => {
      this.setState({ isJumpSlide: false })
      this.currentIndex = to
      this.commit()
    })
  }

  private actions() {
    const { activePage, numberOfPages } = this.store

    return {
      increment: {
        condition: activePage === numberOfPages - 1,
        execute: this.handleIncrementLoop.bind(this)
      },

      decrement: {
        condition: activePage === 0,
        execute: this.handleDecrementLoop.bind(this)
      }
    }
  }

  private getActiveDataIndex(): string {
    return (
      this.slides.find(slide => hasClass(slide, CLASS_VALUES.ACTIVE))?.dataset
        .index || "1"
    )
  }

  private getClonedSlide(dataIndex: string): HTMLElement | undefined {
    return this.slides.find(
      slide =>
        slide.dataset.index === dataIndex &&
        hasClass(slide, CLASS_VALUES.CLONED)
    )
  }

  private handleIncrementLoop() {
    const dataIndex = this.getActiveDataIndex()
    const clonedSlide = this.getClonedSlide(dataIndex)
    const slideNumber = Number(clonedSlide?.dataset.slideNumber)

    this.jump(slideNumber - 1, this.getFirstIndex())
  }

  private handleDecrementLoop() {
    const { slidesPerPage, numberOfPages } = this.store

    this.jump(
      this.getFirstClonedIndex(),
      this.getFirstIndex() + slidesPerPage * (numberOfPages - 1)
    )
  }

  private handleInfiniteLoop(): boolean {
    const { infinite, currentSlideMovement: mov } = this.store
    const action = this.actions()[mov as keyof ReturnType<typeof this.actions>]

    if (!infinite) return false
    if (!action?.condition) return false

    action.execute()

    return true
  }

  nextAction() {
    if (this.handleInfiniteLoop()) return
    this.commit()
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

    this.animation.init({
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
  }

  public getInitialIndexFromClones(): number {
    let cloneCountLeft = 0
    // const slides = Slider.getSlides(this.$root)

    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i]

      if (hasClass(slide, CLASS_VALUES.CLONED)) {
        cloneCountLeft++
      } else {
        break
      }
    }

    return cloneCountLeft
  }
}

/* public defineDotIndex(): void {
    const { isPagedActive, slidesPerPage, slidesPerView } = this.store
    const step = slidesPerPage || 1
    const view = slidesPerView || 1
    const totalSlides = this.slides.length
    const maxStartIndex = Math.max(totalSlides - view, 0)
    let pos = 0

    while (pos <= maxStartIndex) {
      this.validPositions.push(pos)
      pos += step
    }

    if (!isPagedActive) return
    if (!this.validPositions.includes(maxStartIndex))
      this.validPositions.push(maxStartIndex)

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

    let computedDot = this.validPositions.findIndex(pos => pos === startIndex)
    if (computedDot === -1) {
      for (let i = this.validPositions.length - 1; i >= 0; i--) {
        if (this.validPositions[i] <= startIndex) {
          computedDot = i
          break
        }
      }
    }
    computedDot = Math.max(
      0,
      Math.min(computedDot, this.validPositions.length - 1)
    )
    computedDot = this.mapDotIndexForInfinite(computedDot, startIndex)

    this.setState({ dotIndex: computedDot })
  }*/

/* private setIndexBased(params: TypeTargetSlideParams): number {
    const step = this.store.slidesPerPage || 1
    const view = this.store.slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)
    let pos = 0

    while (pos <= maxStartIndex) {
      this.validPositions.push(pos)
      pos += step
    }
    if (!this.validPositions.includes(maxStartIndex))
      this.validPositions.push(maxStartIndex)

    let nextIndex = this.currentIndex

    this.validPositions = [...new Set(this.validPositions)]

    if (params.from === "next") {
      const next = this.validPositions.find(vp => vp > this.currentIndex)
      if (next !== undefined) nextIndex = next
    } else if (params.from === "prev") {
      const prev = [...this.validPositions]
        .reverse()
        .find(vp => vp < this.currentIndex)
      if (prev !== undefined) nextIndex = prev
    } else if (params.from === "dots" || params.from === "touchend") {
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
  }*/
