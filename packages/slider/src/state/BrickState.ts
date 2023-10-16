/* eslint-disable no-prototype-builtins */

import { TypeOptions } from "@/option/Options"

export enum State_Keys {
  isLoadPage = "isLoadPage",
  SlideIndex = "slideIndex",
  SlideSpacing = "slideSpacing",
  SlidesPerPage = "slidesPerPage",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
  SliderReady = "sliderReady",
  isStopSlider = "isStopSlider",
  isDragging = "isDragging",
  startPos = "startPos",
  prevTranslate = "prevTranslate",
  currentTranslate = "currentTranslate",
  TouchStartTime = "touchStartTime",
  TouchEndTime = "touchEndTime",
  IsMouseLeave = "isMouseLeave",
  animationID = "animationID",
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

type StateType = {
  [key: string]: string | number | boolean | null | undefined
  [State_Keys.isLoadPage]: boolean
  [State_Keys.SlideIndex]: number
  [State_Keys.SlideSpacing]: number
  [State_Keys.SlidesPerPage]: number
  [State_Keys.NumberOfSlides]: number
  [State_Keys.SliderWidth]: number
  [State_Keys.SliderReady]: boolean
  [State_Keys.isStopSlider]: boolean
  [State_Keys.isDragging]: boolean
  [State_Keys.startPos]: number
  [State_Keys.prevTranslate]: number
  [State_Keys.currentTranslate]: number
  [State_Keys.TouchStartTime]: number
  [State_Keys.TouchEndTime]: number
  [State_Keys.IsMouseLeave]: boolean
  [State_Keys.animationID]: number
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

class BrickState {
  static state: { [key: string]: StateType } = {}
  private key: string

  constructor(key: string, options: TypeOptions = {}) {
    this.key = key
    if (!BrickState.state[key]) {
      BrickState.state[key] = {} as StateType
      this.initializeState(options)
    }
  }

  private initializeState(options: TypeOptions) {
    BrickState.state[this.key][State_Keys.isLoadPage] = false
    BrickState.state[this.key][State_Keys.SlideIndex] = 0
    BrickState.state[this.key][State_Keys.SlideSpacing] = options.spacing ?? 10
    BrickState.state[this.key][State_Keys.SlidesPerPage] = options.slidesPerPage ?? 1
    BrickState.state[this.key][State_Keys.NumberOfSlides] = 0
    BrickState.state[this.key][State_Keys.SliderWidth] = 0
    BrickState.state[this.key][State_Keys.SliderReady] = true
    BrickState.state[this.key][State_Keys.isStopSlider] = false
    BrickState.state[this.key][State_Keys.isDragging] = false
    BrickState.state[this.key][State_Keys.startPos] = 0
    BrickState.state[this.key][State_Keys.prevTranslate] = 0
    BrickState.state[this.key][State_Keys.currentTranslate] = 0
    BrickState.state[this.key][State_Keys.TouchStartTime] = 0
    BrickState.state[this.key][State_Keys.TouchEndTime] = 0
    BrickState.state[this.key][State_Keys.IsMouseLeave] = true
    BrickState.state[this.key][State_Keys.animationID] = 0
    BrickState.state[this.key][State_Keys.Autoplay] = options.autoplay ?? false
    BrickState.state[this.key][State_Keys.AutoplaySpeed] = options.autoplaySpeed ?? 3000
    BrickState.state[this.key][State_Keys.Dots] = options.dots ?? true
    BrickState.state[this.key][State_Keys.Arrows] = options.arrows ?? true
    BrickState.state[this.key][State_Keys.Touch] = options.touch ?? true
    BrickState.state[this.key][State_Keys.Infinite] = options.infinite ?? false
    BrickState.state[this.key][State_Keys.Speed] = options.speed ?? 300
    BrickState.state[this.key][State_Keys.Transition] = options.transition ?? "slide"
    BrickState.state[this.key][State_Keys.UseTailwind] = options.useTailwind ?? true

    if (options.sliderOptions) {
      for (const key in options.sliderOptions) {
        if (options.sliderOptions.hasOwnProperty(key)) {
          BrickState.state[this.key][key] = options.sliderOptions[key]
        }
      }
    }
  }

  get<K extends keyof StateType>(prop: K): StateType[K] {
    return BrickState.state[this.key][prop] ?? ""
  }

  set<K extends keyof StateType>(prop: K, value: StateType[K]): void {
    BrickState.state[this.key][prop] = value
  }

  setOptions(options: TypeOptions): void {
    this.initializeState(options)
  }

  setMultipleState(props: { [key in keyof StateType]?: StateType[key] }): void {
    for (const key in props) {
      if (props.hasOwnProperty(key)) {
        BrickState.state[this.key][key] = props[key]!
      }
    }
  }
}

export { BrickState as State }
