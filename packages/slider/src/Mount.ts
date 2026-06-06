import { Arrows } from "./Arrows"
import { Dots } from "./Dots"
import { Progress } from "./Progress"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES } from "./helpers"
import {
  appendToParent,
  getChildrenCount,
  DOM_ELEMENT_ALIASES,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
  removeClass,
  setAttributes,
  waitFor
} from "./helpers"
import { KeyframeAnimation, SlideDatasetAttributes } from "./types"
import { ContextMenu } from "./ContextMenu"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"
import { Slider } from "./Slider"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private clone: CloneSlides
  private mutate: Mutate
  private slider: Slider
  private resolvedSlideWidths = new Map<number, string>()

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clone = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
    this.mutate = new Mutate($root)
    this.slider = new Slider($root)
  }

  public init(): void {
    this.setState(this.mountState())
    this.normalizeSlidesConfig()
    this.setProperties()
    this.cloneSlides()
    this.appendSlider()
    this.handleResize()
    this.endMount()
  }

  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAttr(index))
    })
  }
  public normalizeSlidesConfig(): void {
    const { slidesPerPage: originalPerPage, slidesPerView: originalPerView } =
      this.store
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length
    const maxSlidesPerPage = Math.max(1, totalSlides - originalPerView)

    if (originalPerView > totalSlides) {
      const slidesPerViewState = { slidesPerView: totalSlides }

      this.setState(slidesPerViewState)
    }

    if (originalPerView + originalPerPage <= totalSlides) {
      this.setState({
        slidesPerPage: originalPerPage,
        slidesPerView: originalPerView
      })
      return
    }

    this.setState({
      slidesPerPage: Math.min(originalPerPage, maxSlidesPerPage)
    })
  }

  private cloneSlides(): void {
    const { useLoop } = this.store

    if (useLoop) {
      this.clone.init()
      this.slides = BaseSlider.getSlides(this.$root)
      this.slider = new Slider(this.$root)
    }
  }

  private setAttr(index: number): SlideDatasetAttributes {
    return {
      "data-index": index + 1,
      "data-slide-number": index + 1
    }
  }

  private appendSlider(): void {
    const { $children } = this

    this.clonedSlides.forEach((element: HTMLElement | undefined) => {
      appendToParent($children, element)
    })
  }

  private setControls(): void {
    const { arrows, touch, useDragFree } = this.store
    const { $root } = this

    if ($root) new ContextMenu($root).init()
    if (!useDragFree) new Dots($root).init()
    new Progress($root).init()
    if (arrows) new Arrows($root).init()
    if (touch) new Swipe($root).init()
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
    const { gap, slidesPerView, sliderWidth } = this.store
    const totalSpacing = (slidesPerView - 1) * gap
    const availableWidth = sliderWidth - totalSpacing
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth)
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
    const dataIndex = Number(slide?.dataset.index)

    if (Number.isInteger(dataIndex) && dataIndex > 0) {
      return dataIndex - 1
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
    const customEntries = groupPositions
      .filter(groupPosition => typeof customSizes[groupPosition] === "number")
      .map(
        groupPosition => [groupPosition, customSizes[groupPosition]] as const
      )

    if (customEntries.length === 0) return

    const customTotal = customEntries.reduce(
      (total, [, percentage]) => total + percentage,
      0
    )
    const flexiblePositions = groupPositions.filter(
      groupPosition => customSizes[groupPosition] === undefined
    )
    const totalSlots = Math.max(1, groupPositions.length)
    const defaultSlotPercentage = 100 / totalSlots
    const reservedFlexiblePercentage =
      flexiblePositions.length * defaultSlotPercentage
    const maxCustomBudget =
      flexiblePositions.length > 0 ? 100 - reservedFlexiblePercentage : 100
    const scale =
      customTotal > maxCustomBudget ? maxCustomBudget / customTotal : 1
    const normalizedCustomTotal = customEntries.reduce(
      (total, [, percentage]) => total + percentage * scale,
      0
    )
    const remainingPercentage = Math.max(0, 100 - normalizedCustomTotal)
    const fallbackPercentage =
      flexiblePositions.length > 0
        ? remainingPercentage / flexiblePositions.length
        : 0
    const availableWidth = this.getAvailableWidth()

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
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
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
    this.applyResolvedWidthsOnResize()

    waitFor(0, () => this.applyResolvedWidthsOnResize())
  }

  private getPreservedSlideIndexOnResize(): number {
    const { slideIndex } = this.store

    return typeof slideIndex === "number" ? slideIndex : 0
  }

  private applyResolvedWidthsOnResize(): void {
    this.resolvedSlideWidths.clear()
    this.setSlidesWidth()
    this.syncTranslateOnResize()
    this.syncAutoHeight()
    this.syncPaginationOnResize()
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

  private syncPaginationOnResize(): void {
    new Dots(this.$root).init()
    new Progress(this.$root).init()
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

  private setPeekStyle(): void {
    this.animate(this.$track, {} as any, this.options())
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

  private endMount(): void {
    this.setActiveSlides()
    this.setPeekStyle()
    this.setSlidesWidth()
    this.setSlidesWidth()
    this.syncAutoHeight(0, 0)
    this.setVisibility()
    this.setControls()
  }
}
