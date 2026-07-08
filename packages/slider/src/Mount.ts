import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { CLASS_VALUES } from "./helpers"
import {
  appendToParent,
  getChildrenCount,
  DOM_ELEMENT_ALIASES,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
  removeClass,
  waitFor
} from "./helpers"
import type { KeyframeAnimation, StateType } from "./types"
import { ContextMenu } from "./ContextMenu"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"
import { Slider } from "./Slider"
import { SlideMeta } from "./SlideMeta"
import {
  initArrowsFeature,
  initDotsFeature,
  initPagesFeature,
  initProgressFeature,
  initSwipeFeature
} from "./FeatureLoader"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private clone: CloneSlides
  private mutate: Mutate
  private slider: Slider
  private slideMeta: SlideMeta
  private resolvedSlideWidths = new Map<number, string>()

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clone = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
    this.mutate = new Mutate($root)
    this.slider = new Slider($root)
    this.slideMeta = new SlideMeta($root)
  }

  public async init(): Promise<boolean> {
    this.setState(this.mountState())
    this.normalizeSlidesConfig()
    this.setProperties()
    this.cloneSlides()
    this.appendSlider()
    this.handleResize()
    return await this.endMount()
  }

  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      this.slideMeta.setSlideMeta(slide, index, index, false)
    })
  }
  public normalizeSlidesConfig(): void {
    const { slidesPerPage: originalPerPage, slidesPerView: originalPerView } =
      this.store
    const totalSlides = this.getTotalOriginalSlides()
    const slidesConfig = this.getNormalizedSlidesConfig(
      originalPerPage,
      originalPerView,
      totalSlides
    )

    if (originalPerView > totalSlides) {
      this.setState(this.slidesPerViewState(totalSlides))
    }

    this.setState(slidesConfig)
  }

  private getTotalOriginalSlides(): number {
    return this.slides.filter(slide => !hasClass(slide, CLASS_VALUES.CLONED))
      .length
  }

  private getNormalizedSlidesConfig(
    originalPerPage: number,
    originalPerView: number,
    totalSlides: number
  ): Partial<StateType> {
    if (
      this.canUseOriginalSlidesConfig(
        originalPerPage,
        originalPerView,
        totalSlides
      )
    ) {
      return {
        slidesPerPage: originalPerPage,
        slidesPerView: originalPerView
      }
    }

    return {
      slidesPerPage: this.getMaxSlidesPerPage(
        originalPerPage,
        originalPerView,
        totalSlides
      )
    }
  }

  private canUseOriginalSlidesConfig(
    originalPerPage: number,
    originalPerView: number,
    totalSlides: number
  ): boolean {
    return originalPerView + originalPerPage <= totalSlides
  }

  private getMaxSlidesPerPage(
    originalPerPage: number,
    originalPerView: number,
    totalSlides: number
  ): number {
    const maxSlidesPerPage = Math.max(1, totalSlides - originalPerView)

    return Math.min(originalPerPage, maxSlidesPerPage)
  }

  private slidesPerViewState(slidesPerView: number): Partial<StateType> {
    return { slidesPerView }
  }

  private cloneSlides(): void {
    const { useLoop } = this.store

    if (useLoop) {
      this.clone.init()
      this.slides = getSliderNodeList(this.$root)
      this.slider = new Slider(this.$root)
    }
  }

  private appendSlider(): void {
    const { $children } = this

    this.clonedSlides.forEach((element: HTMLElement | undefined) => {
      appendToParent($children, element)
    })
  }

  private async setControls(): Promise<void> {
    const { $root } = this

    if ($root) new ContextMenu($root).init()
    await initDotsFeature($root, this.store)
    await initPagesFeature($root)
    await initProgressFeature($root)
    await initArrowsFeature($root, this.store)
    await initSwipeFeature($root, this.store)
  }

  protected keyFrames(index: number): KeyframeAnimation[] {
    const slideWidth = this.getSlideWidth(index)
    const { gap } = this.store

    return [
      {
        marginRight: `${gap}px`,
        width: slideWidth,
        maxWidth: `100%`,
        boxSizing: "border-box"
      }
    ]
  }

  private getDefaultSlideWidth(): number {
    const availableWidth = this.getAvailableWidth()
    const slideWidth = this.getSlideWidthFromAvailableWidth(availableWidth)

    return Math.max(0, slideWidth)
  }

  private getSlideWidthFromAvailableWidth(availableWidth: number): number {
    const { slidesPerView } = this.store

    return availableWidth / slidesPerView
  }

  private getSlideWidth(index: number): string {
    const slide = this.slides[index]
    const slidePosition = this.getSlidePosition(slide, index)

    if (!this.hasCustomSlideSizes()) {
      return `${this.getDefaultSlideWidth()}px`
    }

    if (!this.resolvedSlideWidths.has(slidePosition)) {
      this.resolveGroupWidths(slidePosition)
    }

    return (
      this.resolvedSlideWidths.get(slidePosition) ??
      `${this.getDefaultSlideWidth()}px`
    )
  }

  private getSlidePosition(
    slide: HTMLElement | undefined,
    fallback: number
  ): number {
    const dataIndex = this.slideMeta.getSlideDataIndex(slide)

    if (Number.isInteger(dataIndex) && dataIndex >= 0) {
      return dataIndex
    }

    return fallback
  }

  private hasCustomSlideSizes(): boolean {
    const { slideSizes } = this.store

    return Object.keys(slideSizes ?? {}).length > 0
  }

  private resolveGroupWidths(position: number): void {
    const groupPositions = this.getGroupPositions(position)
    const { slideSizes } = this.store
    const customSizes = slideSizes ?? {}
    const customEntries = this.getCustomSlideSizeEntries(
      groupPositions,
      customSizes
    )

    if (customEntries.length === 0) return

    const scale = this.getCustomSlideSizeScale(
      groupPositions,
      customEntries,
      customSizes
    )
    const fallbackPercentage = this.getFallbackSlideSizePercentage(
      groupPositions,
      customEntries,
      customSizes,
      scale
    )
    const availableWidth = this.getAvailableWidth()

    this.setResolvedGroupWidths(
      groupPositions,
      customSizes,
      fallbackPercentage,
      scale,
      availableWidth
    )
  }

  private getCustomSlideSizeEntries(
    groupPositions: number[],
    customSizes: Record<number, number>
  ): Array<readonly [number, number]> {
    return groupPositions
      .filter(groupPosition => typeof customSizes[groupPosition] === "number")
      .map(
        groupPosition => [groupPosition, customSizes[groupPosition]] as const
      )
  }

  private getCustomSlideSizeScale(
    groupPositions: number[],
    customEntries: Array<readonly [number, number]>,
    customSizes: Record<number, number>
  ): number {
    const customTotal = this.getCustomSlideSizeTotal(customEntries)
    const maxCustomBudget = this.getMaxCustomSlideSizeBudget(
      groupPositions,
      customSizes
    )

    return customTotal > maxCustomBudget ? maxCustomBudget / customTotal : 1
  }

  private getCustomSlideSizeTotal(
    customEntries: Array<readonly [number, number]>,
    scale = 1
  ): number {
    return customEntries.reduce(
      (total, [, percentage]) => total + percentage * scale,
      0
    )
  }

  private getMaxCustomSlideSizeBudget(
    groupPositions: number[],
    customSizes: Record<number, number>
  ): number {
    const flexiblePositions = this.getFlexibleSlideSizePositions(
      groupPositions,
      customSizes
    )
    const reservedFlexiblePercentage =
      flexiblePositions.length * this.getDefaultSlotPercentage(groupPositions)

    return flexiblePositions.length > 0 ? 100 - reservedFlexiblePercentage : 100
  }

  private getDefaultSlotPercentage(groupPositions: number[]): number {
    const totalSlots = Math.max(1, groupPositions.length)

    return 100 / totalSlots
  }

  private getFallbackSlideSizePercentage(
    groupPositions: number[],
    customEntries: Array<readonly [number, number]>,
    customSizes: Record<number, number>,
    scale: number
  ): number {
    const flexiblePositions = this.getFlexibleSlideSizePositions(
      groupPositions,
      customSizes
    )
    const normalizedCustomTotal = this.getCustomSlideSizeTotal(
      customEntries,
      scale
    )
    const remainingPercentage = Math.max(0, 100 - normalizedCustomTotal)

    return flexiblePositions.length > 0
      ? remainingPercentage / flexiblePositions.length
      : 0
  }

  private getFlexibleSlideSizePositions(
    groupPositions: number[],
    customSizes: Record<number, number>
  ): number[] {
    return groupPositions.filter(
      groupPosition => customSizes[groupPosition] === undefined
    )
  }

  private setResolvedGroupWidths(
    groupPositions: number[],
    customSizes: Record<number, number>,
    fallbackPercentage: number,
    scale: number,
    availableWidth: number
  ): void {
    groupPositions.forEach(groupPosition => {
      const customPercentage = customSizes[groupPosition]
      const percentage =
        customPercentage === undefined
          ? fallbackPercentage
          : customPercentage * scale

      this.resolvedSlideWidths.set(
        groupPosition,
        `${(availableWidth * percentage) / 100}px`
      )
    })
  }

  private getGroupPositions(position: number): number[] {
    const { slidesPerView: currentSlidesPerView } = this.store
    const slidesPerView = currentSlidesPerView || 1
    const totalSlides = getSliderNodeList(this.$root, false).length
    const groupStart = Math.floor(position / slidesPerView) * slidesPerView
    const groupEnd = Math.min(groupStart + slidesPerView, totalSlides)

    return Array.from(
      { length: Math.max(0, groupEnd - groupStart) },
      (_, index) => groupStart + index
    )
  }

  private getAvailableWidth(): number {
    const { gap, slidesPerView, sliderWidth } = this.store
    const totalSpacing = Math.max(0, (slidesPerView - 1) * gap)

    return Math.max(0, sliderWidth - totalSpacing)
  }

  private mountState(): Partial<StateType> {
    const { $children } = this
    const sliderWidth = getSliderWidth($children!)

    this.sliderWidth = sliderWidth

    return {
      sliderWidth,
      numberOfSlides: getChildrenCount($children)
    }
  }

  private handleResize(): void {
    this.resize.init(() => this.syncSlidesWidthOnResize())
  }

  private syncSlidesWidthOnResize(): void {
    this.normalizeSlidesConfig()
    const preservedSlideIndex = this.getPreservedSlideIndexOnResize()
    const resizeState = {
      ...this.mountState(),
      slideIndex: preservedSlideIndex
    }

    this.setState(resizeState)
    void this.applyResolvedWidthsOnResize()

    waitFor(0, () => {
      void this.applyResolvedWidthsOnResize()
    })
  }

  private getPreservedSlideIndexOnResize(): number {
    const { slideIndex } = this.store

    return typeof slideIndex === "number" ? slideIndex : 0
  }

  private async applyResolvedWidthsOnResize(): Promise<void> {
    this.resolvedSlideWidths.clear()
    this.setSlidesWidth()
    this.syncTranslateOnResize()
    this.syncAutoHeight()
    await this.syncPaginationOnResize()
  }

  private syncTranslateOnResize(): void {
    const translate = this.calcTranslateFromCurrentIndex()
    const translateState = {
      prevTranslate: -translate,
      currentTranslate: -translate
    }

    this.setState(translateState)
    this.animate(this.$children, super.keyFrames(-translate), this.options(0))
    this.setActiveSlides()
  }

  private async syncPaginationOnResize(): Promise<void> {
    await initDotsFeature(this.$root, this.store)
    await initProgressFeature(this.$root)
    this.slider = new Slider(this.$root)
    this.slider.updateSlider()
  }

  private calcTranslateFromCurrentIndex(): number {
    const { gap: currentGap, slideIndex } = this.store
    const gap = currentGap || 0
    const index = typeof slideIndex === "number" ? slideIndex : 0
    let translate = 0
    const widthsBeforeIndex: number[] = []

    for (let i = 0; i < index; i++) {
      const slide = this.slides[i]

      if (slide) {
        widthsBeforeIndex.push(slide.offsetWidth)
        translate += slide.offsetWidth + gap
      }
    }

    return this.safeTranslate(translate)
  }

  private setVisibility(): void {
    removeClass(this.getRootSelector!, DOM_ELEMENT_ALIASES.HIDDEN[0])
  }

  private setActiveSlides(): void {
    const visibleIndexes = this.getVisibleSlideIndexes()
    const maxActive = this.getVisualActiveCount()

    this.mutate.updateActiveSlides(visibleIndexes, maxActive)
  }

  public setSlidesWidth(): void {
    this.resolvedSlideWidths.clear()

    this.slides.forEach((slide, index) => {
      this.animate(slide, this.keyFrames(index), this.options())
    })
  }

  private getVisibleSlideIndexes(): number[] {
    const { slidesPerView: currentSlidesPerView, slideIndex } = this.store
    const slidesPerView = currentSlidesPerView || 1
    const firstVisibleIndex = typeof slideIndex === "number" ? slideIndex : 0

    return Array.from(
      { length: slidesPerView },
      (_, i) => firstVisibleIndex + i
    ).filter(index => index >= 0 && index < this.slides.length)
  }

  private getVisualActiveCount(): number {
    const {
      slidesPerView: currentSlidesPerView,
      slidesPerPage: currentSlidesPerPage
    } = this.store
    const slidesPerView = currentSlidesPerView || 1
    const slidesPerPage = currentSlidesPerPage || 1

    return Math.max(1, Math.min(slidesPerView, slidesPerPage))
  }

  private async endMount(): Promise<boolean> {
    this.setActiveSlides()
    this.setSlidesWidth()

    this.syncAutoHeight(0, 0)
    await this.setControls()
    this.slider.updateSlider()
    this.setVisibility()
    return true
  }
}
