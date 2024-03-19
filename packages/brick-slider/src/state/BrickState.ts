/* eslint-disable no-prototype-builtins */

export enum State_Keys {
  IsLoadPage = "isLoadPage",
  Counter = "counter",
  Seconds = "seconds",
  SlideIndex = "slideIndex",
  SlideSpacing = "spacing",
  SlidesPerPage = "slidesPerPage",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
  SliderReady = "sliderReady",
  IsStopSlider = "isStopSlider",
  IsTouch = "isTouch",
  isDragging = "isDragging",
  IsJumpSlide = "isJumpSlide",
  StartPos = "startPos",
  PrevTranslate = "prevTranslate",
  CurrentTranslate = "currentTranslate",
  StartTime = "startTime",
  EndTime = "endTime",
  IsMouseLeave = "isMouseLeave",
  AnimationID = "animationID",
  Autoplay = "autoplay",
  AutoplaySpeed = "autoplaySpeed",
  Dots = "dots",
  Arrows = "arrows",
  Touch = "touch",
  Infinite = "infinite",
  Speed = "speed",
  Transition = "transition",
  UseTailwind = "useTailwind"
}

export type StateType = {
  [key: string]: string | number | boolean | null | undefined
  [State_Keys.IsLoadPage]: boolean
  [State_Keys.Counter]: number
  [State_Keys.Seconds]: number
  [State_Keys.SlideIndex]: number
  [State_Keys.SlideSpacing]: number
  [State_Keys.SlidesPerPage]: number
  [State_Keys.NumberOfSlides]: number
  [State_Keys.SliderWidth]: number
  [State_Keys.SliderReady]: boolean
  [State_Keys.IsStopSlider]: boolean
  [State_Keys.IsTouch]: boolean
  [State_Keys.isDragging]: boolean
  [State_Keys.IsJumpSlide]: boolean
  [State_Keys.StartPos]: number
  [State_Keys.PrevTranslate]: number
  [State_Keys.CurrentTranslate]: number
  [State_Keys.StartTime]: number
  [State_Keys.EndTime]: number
  [State_Keys.IsMouseLeave]: boolean
  [State_Keys.AnimationID]: number
  [State_Keys.Autoplay]: boolean
  [State_Keys.AutoplaySpeed]: number
  [State_Keys.Dots]: boolean
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
  [State_Keys.Autoplay]: boolean
  [State_Keys.AutoplaySpeed]: number
  [State_Keys.Dots]: boolean
  [State_Keys.Arrows]: boolean
  [State_Keys.Touch]: boolean
  [State_Keys.Infinite]: boolean
  [State_Keys.Speed]: number
  [State_Keys.Transition]: string
  [State_Keys.UseTailwind]: boolean
}>

class BrickState {
  static state: { [key: string]: StateType } = {}
  public key: string

  constructor(key: string, options?: Partial<TypeOptions>) {
    this.key = key

    if (!BrickState.state[key]) {
      BrickState.state[key] = {} as StateType
      options && this.initializeState(options)
    }
  }

  private initializeState(options: TypeOptions): void {
    BrickState.state[this.key][State_Keys.IsLoadPage] = false
    BrickState.state[this.key][State_Keys.Counter] = 0
    BrickState.state[this.key][State_Keys.Seconds] = 0
    BrickState.state[this.key][State_Keys.SlideIndex] = 0
    BrickState.state[this.key][State_Keys.SlideSpacing] = options.spacing ?? 10
    BrickState.state[this.key][State_Keys.SlidesPerPage] =
      options.slidesPerPage ?? 1
    BrickState.state[this.key][State_Keys.NumberOfSlides] = 0
    BrickState.state[this.key][State_Keys.SliderWidth] = 0
    BrickState.state[this.key][State_Keys.SliderReady] = true
    BrickState.state[this.key][State_Keys.IsStopSlider] = false
    BrickState.state[this.key][State_Keys.IsTouch] = false
    BrickState.state[this.key][State_Keys.isDragging] = false
    BrickState.state[this.key][State_Keys.IsJumpSlide] = false
    BrickState.state[this.key][State_Keys.StartPos] = 0
    BrickState.state[this.key][State_Keys.PrevTranslate] = 0
    BrickState.state[this.key][State_Keys.CurrentTranslate] = 0
    BrickState.state[this.key][State_Keys.StartTime] = 0
    BrickState.state[this.key][State_Keys.EndTime] = 0
    BrickState.state[this.key][State_Keys.IsMouseLeave] = true
    BrickState.state[this.key][State_Keys.AnimationID] = 0
    BrickState.state[this.key][State_Keys.Autoplay] = options.autoplay ?? false
    BrickState.state[this.key][State_Keys.AutoplaySpeed] =
      options.autoplaySpeed ?? 3000
    BrickState.state[this.key][State_Keys.Dots] = options.dots ?? true
    BrickState.state[this.key][State_Keys.Arrows] = options.arrows ?? true
    BrickState.state[this.key][State_Keys.Touch] = options.touch ?? true
    BrickState.state[this.key][State_Keys.Infinite] = options.infinite ?? false
    BrickState.state[this.key][State_Keys.Speed] = options.speed ?? 300
    BrickState.state[this.key][State_Keys.Transition] =
      options.transition ?? "slide"
    BrickState.state[this.key][State_Keys.UseTailwind] =
      options.useTailwind ?? true
  }

  setOptions(options: TypeOptions): void {
    this.initializeState(options)
  }

  public static store<K extends keyof StateType>(key: K): StateType {
    return BrickState.state[key]
  }

  set(props: { [key in keyof StateType]?: StateType[key] }): void {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        BrickState.state[this.key][key] = props[key]!
      }
    }
  }
}

export { BrickState as State }
