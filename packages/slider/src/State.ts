import {
  CurrentEventType,
  CurrentSlideMovement,
  EventFrom,
  invalidationConditions
} from "./types"

export enum State_Keys {
  PrevSlideIndex = "prevSlideIndex",
  SlideIndex = "slideIndex",
  ActiveIndex = "activeIndex",
  SlideSpacing = "spacing",
  SlidesPerPage = "slidesPerPage",
  SlidesPerView = "slidesPerView",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
  SlideSizes = "slideSizes",
  LeftOverSlides = "leftOverSlides",
  StartX = "startX",
  StartY = "startY",
  EndX = "endX",
  EventFrom = "eventFrom",
  SliderReady = "sliderReady",
  isPagedActive = "isPagedActive",
  isInitialRender = "isInitialRender",
  IsTouch = "isTouch",
  isCompleteGroup = "isCompleteGroup",
  isDragging = "isDragging",
  IsJumpSlide = "isJumpSlide",
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
  UseTailwind = "useTailwind"
}

export type StateType = {
  [key: string]: string | number | boolean | null | undefined | any[] | {}
  [State_Keys.PrevSlideIndex]: number
  [State_Keys.SlideIndex]: number
  [State_Keys.ActiveIndex]: number
  [State_Keys.SlideSpacing]: number
  [State_Keys.SlidesPerPage]: number
  [State_Keys.SlidesPerView]: number
  [State_Keys.NumberOfSlides]: number
  [State_Keys.SliderWidth]: number
  [State_Keys.SlideSizes]: Record<number, string>
  [State_Keys.LeftOverSlides]: number
  [State_Keys.StartX]: number
  [State_Keys.StartY]: number
  [State_Keys.EndX]: number
  [State_Keys.EventFrom]: EventFrom
  [State_Keys.SliderReady]: boolean | null
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
}

export type TypeOptions = Partial<{
  [State_Keys.SlideSpacing]: number
  [State_Keys.SlidesPerPage]: number
  [State_Keys.SlidesPerView]: number
  [State_Keys.SlideSizes]: Record<number, string>
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
    State.state[this.key][State_Keys.ActiveIndex] = 0
    State.state[this.key][State_Keys.SlideIndex] = 0
    State.state[this.key][State_Keys.SlideSpacing] = options.spacing ?? 0
    State.state[this.key][State_Keys.SlidesPerPage] = options.slidesPerPage ?? 1
    State.state[this.key][State_Keys.SlidesPerView] = options.slidesPerView ?? 1
    State.state[this.key][State_Keys.NumberOfSlides] = 0
    State.state[this.key][State_Keys.SliderWidth] = 0
    State.state[this.key][State_Keys.SlideSizes] = options.slideSizes ?? {}
    State.state[this.key][State_Keys.LeftOverSlides] = 0
    State.state[this.key][State_Keys.SliderReady] = null
    State.state[this.key][State_Keys.isInitialRender] = true
    State.state[this.key][State_Keys.IsTouch] = false
    State.state[this.key][State_Keys.isPagedActive] = true
    State.state[this.key][State_Keys.isCompleteGroup] = true
    State.state[this.key][State_Keys.isDragging] = false
    State.state[this.key][State_Keys.IsJumpSlide] = false
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

/*set(props: { [key in keyof StateType]?: StateType[key] }): void {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        State.state[this.key][key] = props[key]!
      }
    }
  }*/

/*set(props: { [key in keyof StateType]?: StateType[key] }): void {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        if (
          (key === State_Keys.PrevTranslate ||
            key === State_Keys.CurrentTranslate) &&
          typeof props[key] === "number" &&
          isNaN(props[key] as number)
        ) {
          continue
        }

        // Caso contrário, atualiza normalmente
        State.state[this.key][key] = props[key]!
      }
    }
  }*/
