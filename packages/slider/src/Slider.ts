import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Progress } from "./Progress"
import { Mutate } from "./Mutate"
import { Observer } from "./Observer"
import { StateType } from "./State"
import { CLASS_VALUES, DOM_ELEMENT_ALIASES, TAGS } from "./helpers"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  removeClass,
  waitFor
} from "./helpers"
import { CurrentEventType, TypeTargetSlideParams } from "./types"

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
    const { useLoop, slidesPerPage, slidesPerView } = this.store

    if (useLoop) {
      return this.computeLoopValidPositions()
    }

    const step = slidesPerPage || 1
    const view = slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)

    const positions: number[] = []
    for (let pos = 0; pos <= maxStartIndex; pos += step) positions.push(pos)
    if (!positions.includes(maxStartIndex)) positions.push(maxStartIndex)
    return positions
  }

  private computeLoopValidPositions(): number[] {
    const { slidesPerPage } = this.store
    const step = slidesPerPage || 1
    const realSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
    const totalReal = realSlides.length
    const cloneOffset = this.getInitialIndexFromClones()
    const positions: number[] = []

    for (let pos = 0; pos < totalReal; pos += step) {
      positions.push(cloneOffset + pos)
    }

    return positions.length > 0 ? positions : [cloneOffset]
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
    const { currentTranslate } = this.store

    this.currentIndex = this.normalizeIndex(
      this.resolveIndexFromTranslate(currentTranslate)
    )
  }

  public calcTranslateForIndex(index: number): number {
    const { gap: currentGap } = this.store
    const gap = currentGap || 0
    let translate = 0
    for (let i = 0; i < index; i++) {
      const slide = this.slides[i]
      if (slide) translate += slide.offsetWidth + gap
    }
    return translate
  }

  public setSlideTarget(params: TypeTargetSlideParams) {
    this.updateCurrentIndexFromTranslate()

    this.currentIndex = this.setIndexBased(params)

    this.nextAction()
  }

  public goToDotIndex(targetIndex: number): void {
    const normalizedIndex = this.normalizeIndex(targetIndex)
    const navigationState: Partial<StateType> = {
      currentSlideMovement: null,
      currentEventType: "dots" as CurrentEventType
    }

    this.setState(navigationState)

    this.currentIndex = normalizedIndex
    this.commitCurrentIndex()
  }

  public goToPageIndex(targetIndex: number): void {
    const positions = [...new Set(this.getPositions())]
    const maxPageIndex = Math.max(0, positions.length - 1)
    const safePageIndex = Math.max(
      0,
      Math.min(Math.floor(targetIndex), maxPageIndex)
    )
    const rawTarget = positions[safePageIndex] ?? positions[0] ?? 0
    const navigationState: Partial<StateType> = {
      currentSlideMovement: null,
      currentEventType: "dots" as CurrentEventType
    }

    this.setState(navigationState)

    this.currentIndex = rawTarget
    this.commitCurrentIndex()
  }

  public goToFreeDirection(direction: "next" | "prev"): void {
    const currentTranslate = this.store.currentTranslate ?? 0
    const offset = this.getDragFreeOffset()
    const nextTranslate =
      direction === "next"
        ? currentTranslate - offset
        : currentTranslate + offset

    this.commitFreeTranslate(nextTranslate)
  }

  public commitFreeTranslate(targetTranslate: number): void {
    const { slideIndex: prevSlideIndex } = this.store
    const currentTranslate = this.clampFreeTranslate(targetTranslate)
    const slideIndex = this.resolveIndexFromTranslate(currentTranslate)
    const activeIndexes = this.getDragFreeActiveIndexes(slideIndex)
    const dragFreeState = {
      prevSlideIndex,
      slideIndex,
      activePage: slideIndex,
      prevTranslate: currentTranslate,
      currentTranslate,
      currentSlideMovement: null
    }

    this.setState(dragFreeState)
    this.syncAutoHeight(slideIndex)
    this.animationFrame()
    this.updateDOM()
    this.mutate.updateActiveSlides(activeIndexes, activeIndexes.length)
    this.emitSlideChange()
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
        const { useLoop } = this.store
        const targetIndex =
          params.from === "touchend" && useLoop
            ? params.touchIndex
            : this.resolveStartIndex(params.touchIndex)

        nextIndex = this.normalizeIndex(targetIndex)
      }
    }

    return nextIndex
  }

  private mapDotIndexForLoop(dotIndex: number, startIndex: number): number {
    const { useLoop, slidesPerPage } = this.store
    if (!useLoop) return dotIndex

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
    const { isPagedActive } = this.store
    if (!isPagedActive) return
    const positions = this.getPositions()
    const { slideIndex } = this.store

    let rawStart =
      typeof slideIndex === "number" ? slideIndex : this.currentIndex
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
    computedDot = this.mapDotIndexForLoop(computedDot, startIndex)

    const dotState = { dotIndex: computedDot }

    this.setState(dotState)
  }

  public updateSlider() {
    this.defineDotIndex()
    this.updateDots(this.$root)
    new Progress(this.$root).sync()
  }

  protected updateDOM(): void {}

  public updateDots($root: string) {
    const { dotIndex, dots: isDots } = this.store
    const selectedIndex = dotIndex ?? 0
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))
    const activePageState = { activePage: selectedIndex }

    this.setState(activePageState)

    if (!isDots) return

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)
      if (hasClass(dot, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0]))
        removeClass(dot, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
      if (i === Math.abs(selectedIndex)) {
        addClass([dot], CLASS_VALUES.SELECTED)
        addClass([dot], DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
      }
    })
  }

  nextAction() {
    const {
      useLoop,
      activePage,
      currentSlideMovement: mov,
      numberOfPages,
      slidesPerView,
      slidesPerPage
    } = this.store

    if (useLoop && mov === "increment" && activePage === numberOfPages - 1) {
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

      const jumpSlideState = { isJumpSlide: true }

      this.setState(jumpSlideState)

      this.commitCurrentIndex()

      waitFor(0, () => {
        const jumpSlideState = { isJumpSlide: false }

        this.setState(jumpSlideState)

        this.currentIndex = this.getFirstIndex()

        this.commitCurrentIndex()
      })

      return
    }
    if (useLoop && mov === "decrement" && activePage === 0) {
      this.currentIndex = this.getFirstClonedIndex()

      this.setState({
        isJumpSlide: true
      })

      this.commitCurrentIndex()

      waitFor(0, () => {
        this.setState({
          isJumpSlide: false
        })
        this.currentIndex =
          this.getFirstIndex() + slidesPerPage * (numberOfPages - 1)

        this.commitCurrentIndex()
      })

      return
    }

    this.commitCurrentIndex()
  }

  private commitCurrentIndex(): void {
    this.syncAutoHeight(this.currentIndex)
    this.animationFrame()
    this.setState(this.mainState())
    this.updateDOM()
    this.updateSlider()
    this.emitSlideChange()
  }

  private resolveIndexFromTranslate(currentTranslate: number): number {
    const { gap: currentGap } = this.store
    const gap = currentGap || 0
    let remaining = Math.abs(currentTranslate)
    let idx = 0

    for (let i = 0; i < this.slides.length; i++) {
      const widthWithGap = this.slides[i].offsetWidth + gap

      if (remaining < widthWithGap) {
        idx = i
        break
      }

      remaining -= widthWithGap
      idx = i + 1
    }

    return Math.max(0, Math.min(idx, this.slides.length - 1))
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
    const { slidesPerView, slidesPerPage, useDragFree } = this.store

    if (useDragFree) {
      this.animation.init().then(() => {})
      return
    }

    const maxActive = Math.max(1, Math.min(slidesPerView, slidesPerPage))
    let intervalId: number | null = null
    this.animation
      .init({
        onStart: () => {
          intervalId = window.setInterval(() => {
            let visibleIndexes = this.observer?.getVisibleSlideIndexes() || []

            this.mutate.updateActiveSlides(visibleIndexes, maxActive)
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

  private clampFreeTranslate(targetTranslate: number): number {
    const maxTranslate = this.getTotalWidth() - (this.store.sliderWidth ?? 0)
    const minTranslate = -Math.max(0, maxTranslate)

    if (targetTranslate > 0) return 0
    if (targetTranslate < minTranslate) return minTranslate

    return targetTranslate
  }

  private getDragFreeOffset(): number {
    const sliderWidth = this.store.sliderWidth ?? this.sliderWidth ?? 0

    return sliderWidth * 0.85
  }

  private getDragFreeActiveIndexes(startIndex: number): number[] {
    const { slidesPerPage, slidesPerView } = this.store
    const maxActive = Math.max(1, Math.min(slidesPerPage, slidesPerView))

    return Array.from(
      { length: maxActive },
      (_, index) => startIndex + index
    ).filter(index => index >= 0 && index < this.slides.length)
  }

  private emitSlideChange(): void {
    const {
      slideIndex,
      prevSlideIndex,
      activePage,
      dotIndex,
      currentEventType
    } = this.store

    this.emit("slideChange", {
      root: this.$root,
      slideIndex,
      prevSlideIndex,
      activePage,
      dotIndex,
      currentEventType
    })
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
