import {
  type ResponsiveBreakpoint,
  type ResponsiveInput,
  type ResponsiveScreensInput,
  type SliderOptions,
  type SlideSizesInput,
  type StateType,
  invalidationConditions
} from "./types"
import {
  DOM_ELEMENT_ALIASES,
  getAllElements,
  getDotsContainer,
  getRootSelector
} from "./helpers"

export enum StateKey {
  PrevSlideIndex = "prevSlideIndex",
  SlideIndex = "slideIndex",
  ActivePage = "activePage",
  ActiveDataIndex = "activeDataIndex",
  InitialSlide = "initialSlide",
  SlideGap = "gap",
  SlidesPerPage = "slidesPerPage",
  SlidesPerView = "slidesPerView",
  BaseSlidesPerPage = "baseSlidesPerPage",
  BaseSlidesPerView = "baseSlidesPerView",
  NumberOfPages = "numberOfPages",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
  SlideSizes = "slideSizes",
  BaseSlideSizes = "baseSlideSizes",
  Screens = "screens",
  Responsive = "responsive",
  ActiveBreakpoint = "activeBreakpoint",
  StartX = "startX",
  StartY = "startY",
  EndX = "endX",
  IsPagedActive = "isPagedActive",
  IsInitialRender = "isInitialRender",
  IsTouch = "isTouch",
  IsCompleteGroup = "isCompleteGroup",
  IsDragging = "isDragging",
  IsJumpSlide = "isJumpSlide",
  IsFastNavigation = "isFastNavigation",
  StartPos = "startPos",
  PrevTranslate = "prevTranslate",
  CurrentTranslate = "currentTranslate",
  CurrentEventType = "currentEventType",
  CurrentSlideMovement = "currentSlideMovement",
  StartTime = "startTime",
  EndTime = "endTime",
  IsMouseLeave = "isMouseLeave",
  AnimationID = "animationID",
  Dots = "dots",
  DotIndex = "dotIndex",
  Arrows = "arrows",
  Touch = "touch",
  UseLoop = "useLoop",
  UseDragFree = "useDragFree",
  UseAutoHeight = "useAutoHeight",
  NavigationLockUntil = "navigationLockUntil"
}

class State {
  private static state: { [key: string]: StateType } = {}
  public key: string

  constructor(key: string, options?: Partial<SliderOptions>) {
    this.key = key

    if (!State.state[key]) {
      State.state[key] = {} as StateType
      options && this.initializeState(options)
    }
  }

  private initializeState(options: SliderOptions): void {
    const initialSlide = this.getInitialSlideIndex(options)
    const initialPage = this.getInitialPageIndex(options, initialSlide)

    State.state[this.key][StateKey.PrevSlideIndex] = 0
    State.state[this.key][StateKey.ActivePage] = initialPage
    State.state[this.key][StateKey.ActiveDataIndex] = 0
    State.state[this.key][StateKey.InitialSlide] = initialSlide
    State.state[this.key][StateKey.SlideIndex] = initialSlide
    State.state[this.key][StateKey.SlideGap] = options.gap ?? 0
    State.state[this.key][StateKey.SlidesPerPage] = options.slidesPerPage ?? 1
    State.state[this.key][StateKey.SlidesPerView] = options.slidesPerView ?? 1
    State.state[this.key][StateKey.BaseSlidesPerPage] =
      options.slidesPerPage ?? 1
    State.state[this.key][StateKey.BaseSlidesPerView] =
      options.slidesPerView ?? 1
    State.state[this.key][StateKey.NumberOfPages] = 0
    State.state[this.key][StateKey.NumberOfSlides] = 0
    State.state[this.key][StateKey.SliderWidth] = 0
    State.state[this.key][StateKey.SlideSizes] = this.normalizeSlideSizes(
      options.slideSizes
    )
    State.state[this.key][StateKey.BaseSlideSizes] = this.normalizeSlideSizes(
      options.slideSizes
    )
    State.state[this.key][StateKey.Screens] = this.normalizeScreens(
      options.screens
    )
    State.state[this.key][StateKey.Responsive] = this.normalizeResponsive(
      options.responsive
    )
    State.state[this.key][StateKey.ActiveBreakpoint] = "base"
    State.state[this.key][StateKey.IsInitialRender] = true
    State.state[this.key][StateKey.IsTouch] = false
    State.state[this.key][StateKey.IsPagedActive] = true
    State.state[this.key][StateKey.IsCompleteGroup] = true
    State.state[this.key][StateKey.IsDragging] = false
    State.state[this.key][StateKey.IsJumpSlide] = false
    State.state[this.key][StateKey.IsFastNavigation] = false
    State.state[this.key][StateKey.StartPos] = 0
    State.state[this.key][StateKey.StartX] = 0
    State.state[this.key][StateKey.StartY] = 0
    State.state[this.key][StateKey.EndX] = 0
    State.state[this.key][StateKey.PrevTranslate] = 0
    State.state[this.key][StateKey.CurrentTranslate] = 0
    State.state[this.key][StateKey.CurrentEventType] = null
    State.state[this.key][StateKey.CurrentSlideMovement] = null
    State.state[this.key][StateKey.StartTime] = 0
    State.state[this.key][StateKey.EndTime] = 0
    State.state[this.key][StateKey.IsMouseLeave] = true
    State.state[this.key][StateKey.AnimationID] = 0
    State.state[this.key][StateKey.UseDragFree] = options.useDragFree ?? false
    State.state[this.key][StateKey.Dots] =
      !State.state[this.key][StateKey.UseDragFree] && this.hasDotsMarkup()
    State.state[this.key][StateKey.DotIndex] = initialPage
    State.state[this.key][StateKey.Arrows] = this.hasArrowsMarkup()
    State.state[this.key][StateKey.Touch] = options.useTouch ?? true
    State.state[this.key][StateKey.UseLoop] =
      !State.state[this.key][StateKey.UseDragFree] && (options.useLoop ?? false)
    State.state[this.key][StateKey.UseAutoHeight] =
      options.useAutoHeight ?? false
    State.state[this.key][StateKey.NavigationLockUntil] = 0
    State.state[this.key][StateKey.IsPagedActive] =
      !State.state[this.key][StateKey.UseDragFree]
  }

  private getInitialSlideIndex(options: SliderOptions): number {
    const initialSlide = options.initialSlide ?? 0

    if (!Number.isFinite(initialSlide) || initialSlide < 0) return 0

    return Math.floor(initialSlide)
  }

  private getInitialPageIndex(
    options: SliderOptions,
    initialSlide: number
  ): number {
    const slidesPerPage = options.slidesPerPage ?? 1
    const safeSlidesPerPage = slidesPerPage > 0 ? slidesPerPage : 1

    return Math.max(0, Math.floor(initialSlide / safeSlidesPerPage))
  }

  private hasDotsMarkup(): boolean {
    const dotsContainer = getDotsContainer(this.key)

    return !!dotsContainer
  }

  private hasArrowsMarkup(): boolean {
    const root = getRootSelector(this.key)

    if (!root) return false

    const arrowSelector = DOM_ELEMENT_ALIASES.ARROW.map(
      className => `.${className}`
    ).join(", ")

    return getAllElements<HTMLElement>(arrowSelector, root).length > 0
  }

  private normalizeSlideSizes(
    slideSizes?: SlideSizesInput
  ): Record<number, number> {
    if (!slideSizes) return {}

    const hasInvalidEntry = Object.entries(slideSizes).some(
      ([position, size]) =>
        !this.isValidSlideSizePosition(Number(position)) ||
        !this.hasSlideSize(size)
    )

    if (hasInvalidEntry) return {}

    const normalizedEntries: Array<[number, number]> = []

    Object.entries(slideSizes).forEach(([position, size]) => {
      const numericPosition = Number(position)

      if (
        this.isValidSlideSizePosition(numericPosition) &&
        this.hasSlideSize(size)
      ) {
        normalizedEntries.push([numericPosition, this.formatSlideSize(size)])
      }
    })

    return normalizedEntries
      .sort(([a], [b]) => a - b)
      .reduce<Record<number, number>>((acc, [position, size]) => {
        acc[position] = size
        return acc
      }, {})
  }

  private isValidSlideSizePosition(position: unknown): position is number {
    return (
      typeof position === "number" &&
      Number.isInteger(position) &&
      position >= 0
    )
  }

  private hasSlideSize(size: unknown): size is number {
    return typeof size === "number" && Number.isFinite(size) && size >= 0
  }

  private formatSlideSize(size: number): number {
    return size
  }

  private normalizeResponsive(responsive?: ResponsiveInput): ResponsiveInput {
    if (!responsive) return {}

    const normalizedResponsive: ResponsiveInput = {}

    Object.entries(responsive).forEach(([breakpoint, config]) => {
      if (!this.isResponsiveBreakpoint(breakpoint) || !config) return

      normalizedResponsive[breakpoint] = {
        slidesPerView: this.getResponsiveNumber(config.slidesPerView),
        slidesPerPage: this.getResponsiveNumber(config.slidesPerPage),
        slideSizes: this.normalizeSlideSizes(config.slideSizes),
        useSlidesPerView: config.useSlidesPerView === false ? false : undefined,
        useSlidesPerPage: config.useSlidesPerPage === false ? false : undefined,
        useSlideSizes: config.useSlideSizes === false ? false : undefined
      }
    })

    return normalizedResponsive
  }

  private normalizeScreens(
    screens?: ResponsiveScreensInput
  ): ResponsiveScreensInput {
    if (!screens) return {}

    const normalizedScreens: ResponsiveScreensInput = {}

    Object.entries(screens).forEach(([breakpoint, value]) => {
      if (!this.isResponsiveBreakpoint(breakpoint)) return

      const numericValue = this.getResponsiveNumber(value)

      if (numericValue !== undefined) {
        normalizedScreens[breakpoint] = numericValue
      }
    })

    return normalizedScreens
  }

  private isResponsiveBreakpoint(
    breakpoint: string
  ): breakpoint is ResponsiveBreakpoint {
    return ["xs", "sm", "md", "lg", "xl", "2xl"].includes(breakpoint)
  }

  private getResponsiveNumber(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) && value >= 0
      ? value
      : undefined
  }

  setOptions(options: SliderOptions): void {
    this.initializeState(options)
  }

  public static store<K extends keyof StateType>(key: K): StateType {
    return State.state[key]
  }

  private invalidationConditions(
    key: keyof StateType,
    value: unknown
  ): invalidationConditions {
    return {
      isPrevOrCurrent:
        key === StateKey.PrevTranslate || key === StateKey.CurrentTranslate,
      isNumber: typeof value === "number",
      isNaNValue: typeof value === "number" && isNaN(value),
      isUndefined: value === undefined
    }
  }

  private shouldInvalidateKey(key: keyof StateType, value: unknown): boolean {
    const { isPrevOrCurrent, isNaNValue, isUndefined } =
      this.invalidationConditions(key, value)

    return (isPrevOrCurrent && isNaNValue) || isUndefined
  }

  set(props: { [key in keyof StateType]?: StateType[key] }): void {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        const value = props[key]
        const shouldInvalidate = this.shouldInvalidateKey(key, value)

        if (!shouldInvalidate) {
          State.state[this.key][key] = value
        }
      }
    }
  }
}

export { State }
