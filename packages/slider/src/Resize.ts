import { BaseSlider } from "./BaseSlider"
import {
  ResponsiveBreakpoint,
  ResponsiveInput,
  ResponsiveScreensInput,
  StateType
} from "./State"
import { getSliderWidth } from "./helpers"

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
    if (this.hasWindowListener) return

    this.hasWindowListener = true

    window.addEventListener("resize", () => {
      if (this.resizeFrame !== null) cancelAnimationFrame(this.resizeFrame)

      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = null
        this.handleSizeChange()
      })
    })
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
    const matchedConfig =
      activeBreakpoint && responsive ? responsive[activeBreakpoint] : undefined
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const shouldIgnoreSlidesPerView = matchedConfig?.useSlidesPerView === false
    const shouldIgnoreSlidesPerPage = matchedConfig?.useSlidesPerPage === false
    const slidesPerView = this.clampSlideCount(
      shouldIgnoreSlidesPerView
        ? baseSlidesPerView
        : (matchedConfig?.slidesPerView ?? baseSlidesPerView),
      totalSlides
    )
    const slidesPerPage = this.clampSlideCount(
      shouldIgnoreSlidesPerPage
        ? baseSlidesPerPage
        : (matchedConfig?.slidesPerPage ?? baseSlidesPerPage),
      totalSlides
    )
    const shouldIgnoreSlideSizes = matchedConfig?.useSlideSizes === false
    const slideSizes = shouldIgnoreSlideSizes
      ? {}
      : matchedConfig?.slideSizes &&
          Object.keys(matchedConfig.slideSizes).length > 0
        ? matchedConfig.slideSizes
        : baseSlideSizes
    const slideIndex = this.getResponsiveSlideIndex(
      totalSlides,
      slidesPerView,
      slidesPerPage
    )

    return {
      slidesPerView,
      slidesPerPage,
      slideSizes,
      slideIndex,
      activeBreakpoint: activeBreakpoint ?? "base"
    }
  }

  private getResponsiveSlideIndex(
    totalSlides: number,
    slidesPerView: number,
    slidesPerPage: number
  ): number {
    const { slideIndex, useLoop } = this.store
    const currentIndex = typeof slideIndex === "number" ? slideIndex : 0

    if (useLoop) return Math.max(0, currentIndex)

    const positions = this.getValidPositions(
      totalSlides,
      slidesPerView,
      slidesPerPage
    )

    if (positions.length === 0) return 0

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
    if (!screens || Object.keys(screens).length === 0) return null
    if (!responsive || Object.keys(responsive).length === 0) return null

    const orderedBreakpoints = Object.entries(screens)
      .filter(([breakpoint, minWidth]) => {
        return (
          responsive[breakpoint as ResponsiveBreakpoint] !== undefined &&
          typeof minWidth === "number"
        )
      })
      .sort(([, a], [, b]) => Number(a) - Number(b)) as Array<
      [ResponsiveBreakpoint, number]
    >

    let activeBreakpoint: ResponsiveBreakpoint | null = null

    orderedBreakpoints.forEach(([breakpoint, minWidth]) => {
      if (sliderWidth >= minWidth) activeBreakpoint = breakpoint
    })

    return activeBreakpoint
  }

  private clampSlideCount(value: number, totalSlides: number): number {
    if (totalSlides <= 0) return 1

    return Math.max(1, Math.min(value, totalSlides))
  }
}
