import { AnimationFrame } from "./AnimationFrame"
import { ArrowSync } from "./ArrowSync"
import { BaseSlider } from "./BaseSlider"
import { Pages } from "./Pages"
import { Progress } from "./Progress"
import { Mutate } from "./Mutate"
import { Observer } from "./Observer"
import type { StateType } from "./types"
import {
  CLASS_VALUES,
  DOM_ELEMENT_ALIASES,
  FROM,
  NavigationDirection,
  SLIDER_EVENTS,
  TAGS,
  TIMES,
  getSlideMovement
} from "./helpers"
import {
  addClass,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  removeClass,
  waitFor
} from "./helpers"
import {
  CurrentEventType,
  CurrentSlideMovement,
  TypeTargetSlideParams
} from "./types"

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
    const step = slidesPerPage || 1
    const view = slidesPerView || 1
    const maxStartIndex = Math.max(this.slides.length - view, 0)
    const positions: number[] = []

    if (useLoop) {
      return this.computeLoopValidPositions()
    }

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

  public setSlideTarget(params: TypeTargetSlideParams): void {
    if (this.shouldBlockPagedNavigation(params.from)) return

    this.updateCurrentIndexFromTranslate()

    this.currentIndex = this.setIndexBased(params)

    this.nextAction()
  }

  public goToDotIndex(targetIndex: number): void {
    if (this.shouldBlockPagedNavigation(FROM.DOTS)) return

    const normalizedIndex = this.normalizeIndex(targetIndex)
    const navigationState: Partial<StateType> = {
      currentSlideMovement: null,
      currentEventType: FROM.DOTS as CurrentEventType
    }

    this.setState(navigationState)

    this.currentIndex = normalizedIndex

    this.commitCurrentIndex()
  }

  public goToPageIndex(targetIndex: number): void {
    if (this.shouldBlockPagedNavigation(FROM.DOTS)) return

    const positions = [...new Set(this.getPositions())]
    const maxPageIndex = Math.max(0, positions.length - 1)
    const safePageIndex = Math.max(
      0,
      Math.min(Math.floor(targetIndex), maxPageIndex)
    )
    const rawTarget = positions[safePageIndex] ?? positions[0] ?? 0
    const navigationState: Partial<StateType> = {
      currentSlideMovement: null,
      currentEventType: FROM.DOTS as CurrentEventType
    }

    this.setState(navigationState)

    this.currentIndex = rawTarget
    this.commitCurrentIndex()
  }

  public goToFreeDirection(direction: NavigationDirection): void {
    if (this.shouldBlockPagedNavigation(direction)) return

    const { currentTranslate: storedTranslate } = this.store
    const currentTranslate = storedTranslate ?? 0
    const offset = this.getDragFreeOffset()
    const nextTranslate =
      direction === FROM.NEXT
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
    this.updateSlider()
    this.emitSlideChange()
  }

  public normalizeIndex(index: number): number {
    this.getPositions()
    return this.nearestPosition(index, this.validPositions)
  }

  private setIndexBased(params: TypeTargetSlideParams): number {
    const positions = [...new Set(this.getPositions())]
    const { from, touchIndex } = params

    if (from === FROM.NEXT) {
      return this.getNextPositionIndex(positions)
    }

    if (from === FROM.PREV) {
      return this.getPrevPositionIndex(positions)
    }

    if (from === FROM.DOTS || from === FROM.TOUCHEND) {
      return this.getTargetIndexFromInput(from, touchIndex)
    }

    return this.currentIndex
  }

  private getNextPositionIndex(positions: number[]): number {
    const nextIndex = positions.find(position => position > this.currentIndex)

    return nextIndex ?? this.currentIndex
  }

  private shouldBlockPagedNavigation(
    from: TypeTargetSlideParams["from"] | typeof FROM.DOTS
  ): boolean {
    const canGuardNavigation = this.canGuardNavigation(from)

    if (!canGuardNavigation) return false

    const isNavigationLocked = this.isNavigationLocked()

    if (isNavigationLocked) return true

    this.lockNavigation()

    return false
  }

  private canGuardNavigation(
    from: TypeTargetSlideParams["from"] | typeof FROM.DOTS
  ): boolean {
    const guardedEvents = [FROM.NEXT, FROM.PREV, FROM.TOUCHEND, FROM.DOTS]

    return guardedEvents.includes(from)
  }

  private isNavigationLocked(): boolean {
    const { navigationLockUntil = 0 } = this.store

    return Date.now() < navigationLockUntil
  }

  private lockNavigation(): void {
    const navigationLockUntil = Date.now() + TIMES.NAVIGATION_GUARD

    this.setState({ navigationLockUntil })
  }

  private getPrevPositionIndex(positions: number[]): number {
    const prevIndex = positions
      .slice()
      .reverse()
      .find(position => position < this.currentIndex)

    return prevIndex ?? this.currentIndex
  }

  private getTargetIndexFromInput(
    from: TypeTargetSlideParams["from"],
    touchIndex?: number
  ): number {
    const { useLoop } = this.store

    if (touchIndex === undefined) return this.currentIndex

    const targetIndex =
      from === FROM.TOUCHEND && useLoop
        ? touchIndex
        : this.resolveStartIndex(touchIndex)

    return this.normalizeIndex(targetIndex)
  }

  private mapDotIndexForLoop(dotIndex: number, startIndex: number): number {
    const { useLoop, slidesPerPage } = this.store
    const realSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
    const safeSlidesPerPage = slidesPerPage || 1
    const totalRealSlides = realSlides.length
    const totalGroups = Math.ceil(totalRealSlides / safeSlidesPerPage)
    const firstRealIndex = this.getRealSlideDataIndex(realSlides[0])
    const lastRealIndex = this.getRealSlideDataIndex(
      realSlides[realSlides.length - 1]
    )

    if (!useLoop) return dotIndex

    if (startIndex < firstRealIndex) return totalGroups - 1
    if (startIndex > lastRealIndex) return 0

    return Math.floor(startIndex / safeSlidesPerPage)
  }

  private getRealSlideDataIndex(slide: HTMLElement | undefined): number {
    return parseInt(slide?.dataset.index || "1", 10) - 1
  }

  public defineDotIndex(): void {
    const { isPagedActive } = this.store
    const positions = this.getPositions()
    const startIndex = this.getDotStartIndex()
    const dotIndex = this.getComputedDotIndex(positions, startIndex)
    const dotState = this.dotIndexState(dotIndex)

    if (!isPagedActive) return

    this.setState(dotState)
  }

  private getDotStartIndex(): number {
    const rawStart = this.getDotRawStartIndex()

    return this.resolveStartIndex(rawStart)
  }

  private getDotRawStartIndex(): number {
    const { slideIndex } = this.store

    return typeof slideIndex === "number" ? slideIndex : this.currentIndex
  }

  private getComputedDotIndex(positions: number[], startIndex: number): number {
    const dotIndex = this.getDotIndexFromPositions(positions, startIndex)
    const safeDotIndex = this.getSafeDotIndex(dotIndex, positions)

    return this.mapDotIndexForLoop(safeDotIndex, startIndex)
  }

  private getDotIndexFromPositions(
    positions: number[],
    startIndex: number
  ): number {
    const directIndex = positions.findIndex(position => position === startIndex)

    if (directIndex !== -1) return directIndex

    return this.getNearestPreviousDotIndex(positions, startIndex)
  }

  private getNearestPreviousDotIndex(
    positions: number[],
    startIndex: number
  ): number {
    for (let i = positions.length - 1; i >= 0; i--) {
      if (positions[i] <= startIndex) return i
    }

    return 0
  }

  private getSafeDotIndex(dotIndex: number, positions: number[]): number {
    return Math.max(0, Math.min(dotIndex, positions.length - 1))
  }

  private dotIndexState(dotIndex: number): Partial<StateType> {
    return { dotIndex }
  }

  public updateSlider(): void {
    this.defineDotIndex()
    this.updateDots(this.$root)
    new Pages(this.$root).sync()
    new ArrowSync(this.$root).sync()
    new Progress(this.$root).sync()
  }

  protected updateDOM(): void {}

  public updateDots($root: string): void {
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

  nextAction(): void {
    const loopJumpAction = this.getLoopJumpAction()

    if (!loopJumpAction) {
      this.commitCurrentIndex()
      return
    }

    this.runLoopJumpAction(loopJumpAction)
  }

  private getLoopJumpAction(): CurrentSlideMovement {
    const { useLoop, activePage, currentSlideMovement, numberOfPages } =
      this.store
    const incrementMovement = getSlideMovement(FROM.NEXT)
    const decrementMovement = getSlideMovement(FROM.PREV)
    const shouldJumpForward =
      useLoop &&
      currentSlideMovement === incrementMovement &&
      activePage === numberOfPages - 1
    const shouldJumpBackward =
      useLoop && currentSlideMovement === decrementMovement && activePage === 0

    if (shouldJumpForward) return incrementMovement
    if (shouldJumpBackward) return decrementMovement

    return null
  }

  private runLoopJumpAction(loopJumpAction: CurrentSlideMovement): void {
    const incrementMovement = getSlideMovement(FROM.NEXT)
    const decrementMovement = getSlideMovement(FROM.PREV)

    if (loopJumpAction === incrementMovement) {
      this.runForwardLoopJump()
      return
    }

    if (loopJumpAction === decrementMovement) {
      this.runBackwardLoopJump()
    }
  }

  private runForwardLoopJump(): void {
    const cloneIndex = this.getForwardLoopCloneIndex()
    const firstIndex = this.getFirstIndex()

    this.currentIndex = cloneIndex
    this.enableJumpSlide()
    this.commitCurrentIndex()
    waitFor(0, () => this.completeLoopJump(firstIndex))
  }

  private getForwardLoopCloneIndex(): number {
    const dataIndex =
      this.slides.find(slide => hasClass(slide, CLASS_VALUES.ACTIVE))?.dataset
        .index || "1"
    const clonedSlide = this.slides.find(
      slide =>
        slide.dataset.index === dataIndex &&
        hasClass(slide, CLASS_VALUES.CLONED)
    )
    const slideNumber = Number(clonedSlide?.dataset.slideNumber)

    return slideNumber - 1
  }

  private runBackwardLoopJump(): void {
    const { slidesPerPage, numberOfPages } = this.store
    const firstClonedIndex = this.getFirstClonedIndex()
    const targetIndex =
      this.getFirstIndex() + slidesPerPage * (numberOfPages - 1)

    this.currentIndex = firstClonedIndex
    this.enableJumpSlide()
    this.commitCurrentIndex()
    waitFor(0, () => this.completeLoopJump(targetIndex))
  }

  private completeLoopJump(targetIndex: number): void {
    this.disableJumpSlide()
    this.currentIndex = targetIndex
    this.commitCurrentIndex()
  }

  private enableJumpSlide(): void {
    this.setState(this.jumpSlideState(true))
  }

  private disableJumpSlide(): void {
    this.setState(this.jumpSlideState(false))
  }

  private jumpSlideState(isJumpSlide: boolean): Partial<StateType> {
    return { isJumpSlide }
  }

  private commitCurrentIndex(): void {
    this.syncCurrentActiveSlides()
    this.syncAutoHeight(this.currentIndex)
    this.animationFrame()
    this.setState(this.mainState())
    this.updateDOM()
    this.updateSlider()
    this.emitSlideChange()
  }

  private syncCurrentActiveSlides(): void {
    const { useDragFree } = this.store

    if (useDragFree) return

    const maxActive = this.getMaxActiveSlides()
    const activeIndexes = this.getPagedActiveIndexes(
      this.currentIndex,
      maxActive
    )
    const canSyncTargetIndexes = this.canSyncTargetActiveIndexes(activeIndexes)

    if (!canSyncTargetIndexes) return

    this.mutate.updateActiveSlides(activeIndexes, activeIndexes.length)
  }

  private canSyncTargetActiveIndexes(activeIndexes: number[]): boolean {
    const visibleIndexes = this.observer?.getVisibleSlideIndexes() || []

    if (visibleIndexes.length === 0) return false

    return activeIndexes.every(index => visibleIndexes.includes(index))
  }

  private getPagedActiveIndexes(
    startIndex: number,
    maxActive: number
  ): number[] {
    return Array.from(
      { length: maxActive },
      (_, index) => startIndex + index
    ).filter(index => index >= 0 && index < this.slides.length)
  }

  private resolveIndexFromTranslate(currentTranslate: number): number {
    const { gap: currentGap } = this.store
    const gap = currentGap || 0
    const remainingTranslate = Math.abs(currentTranslate)
    const resolvedIndex = this.getResolvedIndexFromRemainingTranslate(
      remainingTranslate,
      gap
    )

    return this.getSafeSlideIndex(resolvedIndex)
  }

  private getResolvedIndexFromRemainingTranslate(
    remainingTranslate: number,
    gap: number
  ): number {
    let remaining = remainingTranslate
    let resolvedIndex = 0

    for (let index = 0; index < this.slides.length; index++) {
      const widthWithGap = this.getSlideWidthWithGap(index, gap)

      if (remaining < widthWithGap) {
        resolvedIndex = index
        break
      }

      remaining -= widthWithGap
      resolvedIndex = index + 1
    }

    return resolvedIndex
  }

  private getSlideWidthWithGap(index: number, gap: number): number {
    const slide = this.slides[index]

    return (slide?.offsetWidth ?? 0) + gap
  }

  private getSafeSlideIndex(index: number): number {
    return Math.max(0, Math.min(index, this.slides.length - 1))
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

  private animationFrame(): void {
    const { useDragFree } = this.store

    if (useDragFree) {
      this.runDragFreeAnimation()
      return
    }

    this.runPagedAnimation()
  }

  private runDragFreeAnimation(): void {
    this.animation.init().then(() => {})
  }

  private runPagedAnimation(): void {
    const maxActive = this.getMaxActiveSlides()
    let intervalId: number | null = null

    this.animation
      .init({
        onStart: () => {
          intervalId = this.startActiveSlidesSync(maxActive)
        },
        onEnd: () => {
          intervalId = this.stopActiveSlidesSync(intervalId)
        }
      })
      .then(() => {})
  }

  private startActiveSlidesSync(maxActive: number): number {
    return window.setInterval(() => {
      this.syncActiveSlides(maxActive)
    }, 10)
  }

  private stopActiveSlidesSync(intervalId: number | null): null {
    if (intervalId !== null) clearInterval(intervalId)

    return null
  }

  private syncActiveSlides(maxActive: number): void {
    const visibleIndexes = this.observer?.getVisibleSlideIndexes() || []

    this.mutate.updateActiveSlides(visibleIndexes, maxActive)
  }

  private getMaxActiveSlides(): number {
    const { slidesPerView, slidesPerPage } = this.store

    return Math.max(1, Math.min(slidesPerView, slidesPerPage))
  }

  private clampFreeTranslate(targetTranslate: number): number {
    const { sliderWidth } = this.store
    const maxTranslate = this.getTotalWidth() - (sliderWidth ?? 0)
    const minTranslate = -Math.max(0, maxTranslate)

    if (targetTranslate > 0) return 0
    if (targetTranslate < minTranslate) return minTranslate

    return targetTranslate
  }

  private getDragFreeOffset(): number {
    const { sliderWidth: storedSliderWidth } = this.store
    const sliderWidth = storedSliderWidth ?? this.sliderWidth ?? 0

    return sliderWidth * 0.85
  }

  private getDragFreeActiveIndexes(startIndex: number): number[] {
    const maxActive = this.getMaxActiveSlides()

    return Array.from(
      { length: maxActive },
      (_, index) => startIndex + index
    ).filter(index => index >= 0 && index < this.slides.length)
  }

  private emitSlideChange(): void {
    const { slideIndex, activePage } = this.store

    this.emit(SLIDER_EVENTS.SLIDE_CHANGE, {
      rootSelector: this.$root,
      slideIndex,
      activePage
    })
  }

  public getInitialIndexFromClones(): number {
    let cloneCountLeft = 0
    const slides = getSliderNodeList(this.$root)

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i]
      if (hasClass(slide, CLASS_VALUES.CLONED)) {
        cloneCountLeft++
      } else {
        break
      }
    }

    return cloneCountLeft
  }
}
