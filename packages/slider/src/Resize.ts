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

    if (this.lastObservedWidth === currentWidth) return

    console.log("[BrickSlider][ResizeObserver]", {
      root: this.$root,
      previousWidth: this.lastObservedWidth,
      currentWidth,
      slideIndex: this.store.slideIndex,
      currentTranslate: this.store.currentTranslate,
      prevTranslate: this.store.prevTranslate,
      activePage: this.store.activePage,
      dotIndex: this.store.dotIndex,
      infinite: this.store.infinite
    })

    this.lastObservedWidth = currentWidth
    this.applyResponsiveState()
    this.onResize?.()
  }

  // Aplica o breakpoint ativo com base na largura real do slider, sem depender
  // de Tailwind ou de media query global.
  private applyResponsiveState(): void {
    const sliderWidth = getSliderWidth(this.$children) ?? 0
    const responsiveState = this.getResponsiveState(sliderWidth)

    this.setState({
      sliderWidth,
      ...responsiveState
    })
  }

  private getResponsiveState(sliderWidth: number): Partial<StateType> {
    const screens = this.store.screens as ResponsiveScreensInput
    const responsive = this.store.responsive as ResponsiveInput
    const activeBreakpoint = this.getActiveBreakpoint(
      sliderWidth,
      screens,
      responsive
    )
    const matchedConfig =
      activeBreakpoint && responsive ? responsive[activeBreakpoint] : undefined
    const totalSlides = BaseSlider.getSlides(this.$root, false).length
    const slidesPerView = this.clampSlideCount(
      matchedConfig?.slidesPerView ?? this.store.baseSlidesPerView,
      totalSlides
    )
    const slidesPerPage = this.clampSlideCount(
      matchedConfig?.slidesPerPage ?? this.store.baseSlidesPerPage,
      totalSlides
    )
    const slideSizes =
      matchedConfig?.slideSizes &&
      Object.keys(matchedConfig.slideSizes).length > 0
        ? matchedConfig.slideSizes
        : this.store.baseSlideSizes
    const maxStartIndex = Math.max(totalSlides - slidesPerView, 0)
    const slideIndex = this.store.infinite
      ? (this.store.slideIndex ?? 0)
      : Math.min(this.store.slideIndex ?? 0, maxStartIndex)

    return {
      slidesPerView,
      slidesPerPage,
      slideSizes,
      slideIndex,
      activeBreakpoint: activeBreakpoint ?? "base"
    }
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
