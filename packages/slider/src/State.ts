import {
  CurrentEventType,
  CurrentSlideMovement,
  EventFrom,
  invalidationConditions
} from "./types"

export const state = {
  prevSlideIndex: "prevSlideIndex",
  statelideIndex: "slideIndex",
  jumpIndex: "jumpIndex",
  activePage: "activePage",
  activeDataIndex: "activeDataIndex",
  slideSpacing: "spacing",
  slidesPerPage: "slidesPerPage",
  slidesPerView: "slidesPerView",
  baseSlidesPerPage: "baseSlidesPerPage",
  baseSlidesPerView: "baseSlidesPerView",
  numberOfPages: "numberOfPages",
  numberOfSlides: "numberOfSlides",
  sliderWidth: "sliderWidth",
  slideSizes: "slideSizes",
  baseSlideSizes: "baseSlideSizes",
  screens: "screens",
  responsive: "responsive",
  activeBreakpoint: "activeBreakpoint",
  leftOverSlides: "leftOverSlides",
  startX: "startX",
  startY: "startY",
  endX: "endX",
  eventFrom: "eventFrom",
  sliderReady: "sliderReady",
  isPagedActive: "isPagedActive",
  isInitialRender: "isInitialRender",
  isTouch: "isTouch",
  isCompleteGroup: "isCompleteGroup",
  isDragging: "isDragging",
  isJumpSlide: "isJumpSlide",
  isFastNavigation: "isFastNavigation",
  startPos: "startPos",
  prevTranslate: "prevTranslate",
  currentTranslate: "currentTranslate",
  currentEventType: "currentEventType",
  currentSlideMovement: "currentSlideMovement",
  currentAnimation: "currentAnimation",
  startTime: "startTime",
  endTime: "endTime",
  isMouseLeave: "isMouseLeave",
  animationID: "animationID",
  autoplay: "autoplay",
  autoplaySpeed: "autoplaySpeed",
  dots: "dots",
  dotIndex: "dotIndex",
  arrows: "arrows",
  touch: "touch",
  infinite: "infinite",
  speed: "speed",
  transition: "transition",
  useTailwind: "useTailwind",
  targetSlides: "targetSlides"
} as const

export enum State_Keys {
  PrevSlideIndex = "prevSlideIndex",
  SlideIndex = "slideIndex",
  JumpIndex = "jumpIndex",
  ActivePage = "activePage",
  ActivePosition = "activePosition",
  ActiveDataIndex = "activeDataIndex",
  SlideSpacing = "spacing",
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
  LeftOverSlides = "leftOverSlides",
  StartX = "startX",
  StartY = "startY",
  EndX = "endX",
  EventFrom = "eventFrom",
  SliderReady = "sliderReady",
  isSlidesPerPageAdjusted = "isSlidesPerPageAdjusted",
  isPagedActive = "isPagedActive",
  isInitialRender = "isInitialRender",
  IsTouch = "isTouch",
  isCompleteGroup = "isCompleteGroup",
  isDragging = "isDragging",
  IsJumpSlide = "isJumpSlide",
  isFastNavigation = "isFastNavigation",
  StartPos = "startPos",
  PrevTranslate = "prevTranslate",
  CurrentTranslate = "currentTranslate",
  CurrentEventType = "currentEventType",
  CurrentSlideMovement = "currentSlideMovement",
  CurrentAnimation = "currentAnimation",
  StartTime = "startTime",
  EndTime = "endTime",
  IsMouseLeave = "isMouseLeave",
  AnimationID = "animationID",
  Autoplay = "autoplay",
  AutoplaySpeed = "autoplaySpeed",
  Dots = "dots",
  DotIndex = "dotIndex",
  Arrows = "arrows",
  Touch = "touch",
  Infinite = "infinite",
  Speed = "speed",
  Transition = "transition",
  UseTailwind = "useTailwind",
  TargetSlides = "targetSlides"
}

export type StateType = {
  [key: string]: string | number | boolean | null | undefined | any[] | {}
  [State_Keys.PrevSlideIndex]: number
  [State_Keys.JumpIndex]: number
  [State_Keys.SlideIndex]: number
  [State_Keys.ActivePosition]: number
  [State_Keys.ActiveDataIndex]: number
  [State_Keys.ActivePage]: number
  [State_Keys.SlideSpacing]: number
  [State_Keys.SlidesPerPage]: number
  [State_Keys.SlidesPerView]: number
  [State_Keys.BaseSlidesPerPage]: number
  [State_Keys.BaseSlidesPerView]: number
  [State_Keys.NumberOfPages]: number
  [State_Keys.NumberOfSlides]: number
  [State_Keys.SliderWidth]: number
  [State_Keys.SlideSizes]: Record<number, number>
  [State_Keys.BaseSlideSizes]: Record<number, number>
  [State_Keys.Screens]: ResponsiveScreensInput
  [State_Keys.Responsive]: ResponsiveInput
  [State_Keys.ActiveBreakpoint]: ResponsiveBreakpoint | "base" | null
  [State_Keys.LeftOverSlides]: number
  [State_Keys.StartX]: number
  [State_Keys.StartY]: number
  [State_Keys.EndX]: number
  [State_Keys.EventFrom]: EventFrom
  [State_Keys.SliderReady]: boolean | null
  [State_Keys.isSlidesPerPageAdjusted]: boolean
  [State_Keys.IsTouch]: boolean
  [State_Keys.isInitialRender]: boolean
  [State_Keys.isPagedActive]: boolean
  [State_Keys.isCompleteGroup]: boolean
  [State_Keys.isDragging]: boolean
  [State_Keys.IsJumpSlide]: boolean
  [State_Keys.StartPos]: number
  [State_Keys.PrevTranslate]: number
  [State_Keys.CurrentTranslate]: number
  [State_Keys.CurrentEventType]: CurrentEventType
  [State_Keys.CurrentSlideMovement]: CurrentSlideMovement
  [State_Keys.CurrentAnimation]: any[]
  [State_Keys.StartTime]: number
  [State_Keys.EndTime]: number
  [State_Keys.IsMouseLeave]: boolean
  [State_Keys.AnimationID]: number
  [State_Keys.Autoplay]: boolean
  [State_Keys.AutoplaySpeed]: number
  [State_Keys.Dots]: boolean
  [State_Keys.DotIndex]: number
  [State_Keys.Arrows]: boolean
  [State_Keys.Touch]: boolean
  [State_Keys.Infinite]: boolean
  [State_Keys.Speed]: number
  [State_Keys.Transition]: string
  [State_Keys.UseTailwind]: boolean
  [State_Keys.TargetSlides]: number[]
}

export type SlideSizesInput = Record<number, number>

export type ResponsiveBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"

export type ResponsiveScreensInput = Partial<
  Record<ResponsiveBreakpoint, number>
>

export type ResponsiveOption = Partial<{
  [State_Keys.SlidesPerPage]: number
  [State_Keys.SlidesPerView]: number
  [State_Keys.SlideSizes]: SlideSizesInput
}>

export type ResponsiveInput = Partial<
  Record<ResponsiveBreakpoint, ResponsiveOption>
>

export type TypeOptions = Partial<{
  [State_Keys.SlideSpacing]: number
  [State_Keys.SlidesPerPage]: number
  [State_Keys.SlidesPerView]: number
  [State_Keys.SlideSizes]: SlideSizesInput
  [State_Keys.Screens]: ResponsiveScreensInput
  [State_Keys.Responsive]: ResponsiveInput
  [State_Keys.Autoplay]: boolean
  [State_Keys.AutoplaySpeed]: number
  [State_Keys.Dots]: boolean
  [State_Keys.StartX]: number
  [State_Keys.EndX]: number
  [State_Keys.Arrows]: boolean
  [State_Keys.Touch]: boolean
  [State_Keys.Infinite]: boolean
  [State_Keys.Speed]: number
  [State_Keys.Transition]: string
  [State_Keys.UseTailwind]: boolean
}>

class State {
  private static state: { [key: string]: StateType } = {}
  public key: string

  constructor(key: string, options?: Partial<TypeOptions>) {
    this.key = key

    if (!State.state[key]) {
      State.state[key] = {} as StateType
      options && this.initializeState(options)
    }
  }

  private initializeState(options: TypeOptions): void {
    State.state[this.key][State_Keys.PrevSlideIndex] = 0
    State.state[this.key][State_Keys.ActivePage] = 0
    State.state[this.key][State_Keys.ActiveDataIndex] = 0
    State.state[this.key][State_Keys.ActivePosition] = 0
    State.state[this.key][State_Keys.JumpIndex] = 0
    State.state[this.key][State_Keys.SlideIndex] = 0
    State.state[this.key][State_Keys.SlideSpacing] = options.spacing ?? 0
    State.state[this.key][State_Keys.SlidesPerPage] = options.slidesPerPage ?? 1
    State.state[this.key][State_Keys.SlidesPerView] = options.slidesPerView ?? 1
    State.state[this.key][State_Keys.BaseSlidesPerPage] =
      options.slidesPerPage ?? 1
    State.state[this.key][State_Keys.BaseSlidesPerView] =
      options.slidesPerView ?? 1
    State.state[this.key][State_Keys.NumberOfPages] = 0
    State.state[this.key][State_Keys.NumberOfSlides] = 0
    State.state[this.key][State_Keys.SliderWidth] = 0
    // Normaliza `slideSizes` como percentuais numéricos por posição.
    // Se vier fora de ordem, o mapa final fica ordenado.
    State.state[this.key][State_Keys.SlideSizes] = this.normalizeSlideSizes(
      options.slideSizes
    )
    State.state[this.key][State_Keys.BaseSlideSizes] =
      this.normalizeSlideSizes(options.slideSizes)
    State.state[this.key][State_Keys.Screens] = this.normalizeScreens(
      options.screens
    )
    // Guarda os overrides responsivos fora do Tailwind para o ResizeObserver
    // aplicar por largura real do slider.
    State.state[this.key][State_Keys.Responsive] = this.normalizeResponsive(
      options.responsive
    )
    State.state[this.key][State_Keys.ActiveBreakpoint] = "base"
    State.state[this.key][State_Keys.LeftOverSlides] = 0
    State.state[this.key][State_Keys.SliderReady] = null
    State.state[this.key][State_Keys.isSlidesPerPageAdjusted] = false
    State.state[this.key][State_Keys.isInitialRender] = true
    State.state[this.key][State_Keys.IsTouch] = false
    State.state[this.key][State_Keys.isPagedActive] = true
    State.state[this.key][State_Keys.isCompleteGroup] = true
    State.state[this.key][State_Keys.isDragging] = false
    State.state[this.key][State_Keys.IsJumpSlide] = false
    State.state[this.key][State_Keys.isFastNavigation] = false
    State.state[this.key][State_Keys.StartPos] = 0
    State.state[this.key][State_Keys.StartX] = 0
    State.state[this.key][State_Keys.StartY] = 0
    State.state[this.key][State_Keys.EndX] = 0
    State.state[this.key][State_Keys.EventFrom] = null
    State.state[this.key][State_Keys.PrevTranslate] = 0
    State.state[this.key][State_Keys.CurrentTranslate] = 0
    State.state[this.key][State_Keys.CurrentEventType] = null
    State.state[this.key][State_Keys.CurrentSlideMovement] = null
    State.state[this.key][State_Keys.CurrentAnimation] = []
    State.state[this.key][State_Keys.StartTime] = 0
    State.state[this.key][State_Keys.EndTime] = 0
    State.state[this.key][State_Keys.IsMouseLeave] = true
    State.state[this.key][State_Keys.AnimationID] = 0
    State.state[this.key][State_Keys.Autoplay] = options.autoplay ?? false
    State.state[this.key][State_Keys.AutoplaySpeed] =
      options.autoplaySpeed ?? 3000
    State.state[this.key][State_Keys.Dots] = options.dots ?? true
    State.state[this.key][State_Keys.DotIndex] = 0
    State.state[this.key][State_Keys.Arrows] = options.arrows ?? true
    State.state[this.key][State_Keys.Touch] = options.touch ?? true
    State.state[this.key][State_Keys.Infinite] = options.infinite ?? false
    State.state[this.key][State_Keys.Speed] = options.speed ?? 300
    State.state[this.key][State_Keys.Transition] = options.transition ?? "slide"
    State.state[this.key][State_Keys.UseTailwind] = options.useTailwind ?? true
    State.state[this.key][State_Keys.TargetSlides] = []
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

  private normalizeResponsive(
    responsive?: ResponsiveInput
  ): ResponsiveInput {
    if (!responsive) return {}

    const normalizedResponsive: ResponsiveInput = {}

    Object.entries(responsive).forEach(([breakpoint, config]) => {
      if (!this.isResponsiveBreakpoint(breakpoint) || !config) return

      normalizedResponsive[breakpoint] = {
        slidesPerView: this.getResponsiveNumber(config.slidesPerView),
        slidesPerPage: this.getResponsiveNumber(config.slidesPerPage),
        slideSizes: this.normalizeSlideSizes(config.slideSizes)
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

  setOptions(options: TypeOptions): void {
    this.initializeState(options)
  }

  public static store<K extends keyof StateType>(key: K): StateType {
    return State.state[key]
  }

  private invalidationConditions(
    key: keyof StateType,
    value: any
  ): invalidationConditions {
    return {
      isPrevOrCurrent:
        key === State_Keys.PrevTranslate || key === State_Keys.CurrentTranslate,
      isNumber: typeof value === "number",
      isNaNValue: typeof value === "number" && isNaN(value),
      isUndefined: value === undefined
    }
  }

  private shouldInvalidateKey(key: keyof StateType, value: any): boolean {
    const { isPrevOrCurrent, isNumber, isNaNValue, isUndefined } =
      this.invalidationConditions(key, value)

    // Se for um campo específico e o valor for inválido
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
