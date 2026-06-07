import { BaseSlider } from "./BaseSlider"
import type {
  ResponsiveBreakpoint,
  ResponsiveInput,
  ResponsiveOption,
  ResponsiveScreensInput,
  StateType
} from "./types"
import { EVENTS, getSliderNodeList, getSliderWidth, listener } from "./helpers"

export class Resize extends BaseSlider {
  private resizeObserver: ResizeObserver | null = null
  private onResize?: () => void
  private lastObservedWidth: number | null = null
  private lastObservedViewportWidth: number | null = null
  private hasWindowListener = false
  private resizeFrame: number | null = null

  constructor($root: string) {
    super($root)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  public init(onResize?: () => void): void {
    this.onResize = onResize
    this.observe()
    this.listenWindowResize()
    this.applyResponsiveState()
    this.onResize?.()
  }

  private observe(): void {
    const target = this.getRootSelector ?? this.$children

    if (this.resizeObserver || !target) return

    this.resizeObserver = new ResizeObserver(() => this.handleSizeChange())
    this.lastObservedWidth = getSliderWidth(this.$children) ?? 0
    this.lastObservedViewportWidth = this.getViewportWidth()
    this.resizeObserver.observe(target)
  }

  private listenWindowResize(): void {
    const hasWindowListener = this.hasWindowListener

    if (hasWindowListener) return

    this.enableWindowListener()
    this.bindWindowResize()
  }

  private enableWindowListener(): void {
    this.hasWindowListener = true
  }

  private bindWindowResize(): void {
    listener([EVENTS.RESIZE], window, () => this.scheduleWindowResize())
  }

  private scheduleWindowResize(): void {
    const hasPendingResizeFrame = this.hasPendingResizeFrame()

    if (hasPendingResizeFrame) this.cancelResizeFrame()

    this.resizeFrame = requestAnimationFrame(() => {
      this.clearResizeFrame()
      this.handleSizeChange()
    })
  }

  private hasPendingResizeFrame(): boolean {
    return this.resizeFrame !== null
  }

  private cancelResizeFrame(): void {
    if (this.resizeFrame === null) return

    cancelAnimationFrame(this.resizeFrame)
  }

  private clearResizeFrame(): void {
    this.resizeFrame = null
  }

  private handleSizeChange(): void {
    const currentWidth = getSliderWidth(this.$children) ?? 0
    const currentViewportWidth = this.getViewportWidth()
    const hasContainerChange = this.lastObservedWidth !== currentWidth
    const hasViewportChange =
      this.lastObservedViewportWidth !== currentViewportWidth

    if (!hasContainerChange && !hasViewportChange) return

    this.lastObservedWidth = currentWidth
    this.lastObservedViewportWidth = currentViewportWidth
    this.applyResponsiveState()
    this.onResize?.()
  }

  private applyResponsiveState(): void {
    const sliderWidth = getSliderWidth(this.$children) ?? 0
    const viewportWidth = this.getViewportWidth()
    const responsiveState = this.getResponsiveState(viewportWidth)

    this.setState({
      sliderWidth,
      ...responsiveState
    })
  }

  private getViewportWidth(): number {
    if (typeof window === "undefined") return 0

    return window.innerWidth
  }

  private getResponsiveState(sliderWidth: number): Partial<StateType> {
    const responsiveContext = this.getResponsiveContext(sliderWidth)
    const responsiveSlideCounts = this.getResponsiveSlideCounts(
      responsiveContext.matchedConfig,
      responsiveContext.baseSlidesPerView,
      responsiveContext.baseSlidesPerPage,
      responsiveContext.totalSlides
    )
    const slideSizes = this.getResponsiveSlideSizes(
      responsiveContext.matchedConfig,
      responsiveContext.baseSlideSizes
    )
    const slideIndex = this.getResponsiveSlideIndex(
      responsiveContext.totalSlides,
      responsiveSlideCounts.slidesPerView,
      responsiveSlideCounts.slidesPerPage
    )

    return this.createResponsiveState(
      responsiveSlideCounts.slidesPerView,
      responsiveSlideCounts.slidesPerPage,
      slideSizes,
      slideIndex,
      responsiveContext.activeBreakpoint
    )
  }

  private getResponsiveContext(sliderWidth: number): {
    activeBreakpoint: ResponsiveBreakpoint | null
    baseSlideSizes: Record<number, number>
    baseSlidesPerPage: number
    baseSlidesPerView: number
    matchedConfig: ResponsiveOption | undefined
    totalSlides: number
  } {
    const {
      screens: rawScreens,
      responsive: rawResponsive,
      baseSlidesPerView,
      baseSlidesPerPage,
      baseSlideSizes
    } = this.store
    const screens = rawScreens as ResponsiveScreensInput
    const responsive = rawResponsive as ResponsiveInput
    const activeBreakpoint = this.getActiveBreakpoint(
      sliderWidth,
      screens,
      responsive
    )
    const matchedConfig = this.getMatchedResponsiveConfig(
      activeBreakpoint,
      responsive
    )
    const totalSlides = getSliderNodeList(this.$root, false).length

    return {
      activeBreakpoint,
      baseSlideSizes,
      baseSlidesPerPage,
      baseSlidesPerView,
      matchedConfig,
      totalSlides
    }
  }

  private getResponsiveSlideCounts(
    matchedConfig: ResponsiveOption | undefined,
    baseSlidesPerView: number,
    baseSlidesPerPage: number,
    totalSlides: number
  ): {
    slidesPerPage: number
    slidesPerView: number
  } {
    const slidesPerView = this.getResponsiveSlidesPerView(
      matchedConfig,
      baseSlidesPerView,
      totalSlides
    )
    const slidesPerPage = this.getResponsiveSlidesPerPage(
      matchedConfig,
      baseSlidesPerPage,
      totalSlides
    )

    return { slidesPerPage, slidesPerView }
  }

  private createResponsiveState(
    slidesPerView: number,
    slidesPerPage: number,
    slideSizes: Record<number, number>,
    slideIndex: number,
    activeBreakpoint: ResponsiveBreakpoint | null
  ): Partial<StateType> {
    return {
      slidesPerView,
      slidesPerPage,
      slideSizes,
      slideIndex,
      activeBreakpoint: activeBreakpoint ?? "base"
    }
  }

  private getMatchedResponsiveConfig(
    activeBreakpoint: ResponsiveBreakpoint | null,
    responsive?: ResponsiveInput
  ): ResponsiveOption | undefined {
    if (!activeBreakpoint || !responsive) return undefined

    return responsive[activeBreakpoint]
  }

  private getResponsiveSlidesPerView(
    matchedConfig: ResponsiveOption | undefined,
    baseSlidesPerView: number,
    totalSlides: number
  ): number {
    const shouldIgnoreSlidesPerView = matchedConfig?.useSlidesPerView === false
    const slidesPerView = shouldIgnoreSlidesPerView
      ? baseSlidesPerView
      : (matchedConfig?.slidesPerView ?? baseSlidesPerView)

    return this.clampSlideCount(slidesPerView, totalSlides)
  }

  private getResponsiveSlidesPerPage(
    matchedConfig: ResponsiveOption | undefined,
    baseSlidesPerPage: number,
    totalSlides: number
  ): number {
    const shouldIgnoreSlidesPerPage = matchedConfig?.useSlidesPerPage === false
    const slidesPerPage = shouldIgnoreSlidesPerPage
      ? baseSlidesPerPage
      : (matchedConfig?.slidesPerPage ?? baseSlidesPerPage)

    return this.clampSlideCount(slidesPerPage, totalSlides)
  }

  private getResponsiveSlideSizes(
    matchedConfig: ResponsiveOption | undefined,
    baseSlideSizes: Record<number, number>
  ): Record<number, number> {
    const shouldIgnoreSlideSizes = matchedConfig?.useSlideSizes === false
    const hasResponsiveSlideSizes = !!matchedConfig?.slideSizes &&
      Object.keys(matchedConfig.slideSizes).length > 0

    if (shouldIgnoreSlideSizes) return {}
    if (hasResponsiveSlideSizes) return matchedConfig!.slideSizes!

    return baseSlideSizes
  }

  private getResponsiveSlideIndex(
    totalSlides: number,
    slidesPerView: number,
    slidesPerPage: number
  ): number {
    const { slideIndex, useLoop } = this.store
    const currentIndex = this.getCurrentResponsiveSlideIndex(slideIndex)
    const positions = this.getValidPositions(
      totalSlides,
      slidesPerView,
      slidesPerPage
    )

    if (useLoop) return this.getLoopResponsiveSlideIndex(currentIndex)
    if (positions.length === 0) return 0

    return this.getClosestResponsiveSlideIndex(currentIndex, positions)
  }

  private getCurrentResponsiveSlideIndex(slideIndex: number): number {
    return typeof slideIndex === "number" ? slideIndex : 0
  }

  private getLoopResponsiveSlideIndex(currentIndex: number): number {
    return Math.max(0, currentIndex)
  }

  private getClosestResponsiveSlideIndex(
    currentIndex: number,
    positions: number[]
  ): number {
    return positions.reduce((closest, position) => {
      return Math.abs(position - currentIndex) <
        Math.abs(closest - currentIndex)
        ? position
        : closest
    }, positions[0])
  }

  private getValidPositions(
    totalSlides: number,
    slidesPerView: number,
    slidesPerPage: number
  ): number[] {
    const maxStartIndex = Math.max(totalSlides - slidesPerView, 0)
    const step = Math.max(1, slidesPerPage)
    const positions: number[] = []

    for (let pos = 0; pos <= maxStartIndex; pos += step) positions.push(pos)

    if (!positions.includes(maxStartIndex)) positions.push(maxStartIndex)

    return positions
  }

  private getActiveBreakpoint(
    sliderWidth: number,
    screens?: ResponsiveScreensInput,
    responsive?: ResponsiveInput
  ): ResponsiveBreakpoint | null {
    const hasResponsiveConfig = this.hasResponsiveConfig(screens, responsive)
    const orderedBreakpoints = this.getOrderedBreakpoints(screens, responsive)

    if (!hasResponsiveConfig) return null

    return this.resolveActiveBreakpoint(sliderWidth, orderedBreakpoints)
  }

  private hasResponsiveConfig(
    screens?: ResponsiveScreensInput,
    responsive?: ResponsiveInput
  ): boolean {
    return !!screens &&
      Object.keys(screens).length > 0 &&
      !!responsive &&
      Object.keys(responsive).length > 0
  }

  private getOrderedBreakpoints(
    screens?: ResponsiveScreensInput,
    responsive?: ResponsiveInput
  ): Array<[ResponsiveBreakpoint, number]> {
    if (!screens || !responsive) return []

    return Object.entries(screens)
      .filter(([breakpoint, minWidth]) => {
        return this.isConfiguredBreakpoint(breakpoint, minWidth, responsive)
      })
      .sort(([, a], [, b]) => Number(a) - Number(b)) as Array<
      [ResponsiveBreakpoint, number]
    >
  }

  private isConfiguredBreakpoint(
    breakpoint: string,
    minWidth: number | undefined,
    responsive: ResponsiveInput
  ): boolean {
    return (
      responsive[breakpoint as ResponsiveBreakpoint] !== undefined &&
      typeof minWidth === "number"
    )
  }

  private resolveActiveBreakpoint(
    sliderWidth: number,
    orderedBreakpoints: Array<[ResponsiveBreakpoint, number]>
  ): ResponsiveBreakpoint | null {
    return orderedBreakpoints.reduce<ResponsiveBreakpoint | null>(
      (activeBreakpoint, [breakpoint, minWidth]) => {
        if (sliderWidth >= minWidth) return breakpoint

        return activeBreakpoint
      },
      null
    )
  }

  private clampSlideCount(value: number, totalSlides: number): number {
    if (totalSlides <= 0) return 1

    return Math.max(1, Math.min(value, totalSlides))
  }
}
