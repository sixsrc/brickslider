/* eslint-disable no-prototype-builtins */
import { IOptions } from "../option/IOptions"

export enum State_Keys {
  RootSelector = "rootSelector",
  LoadPage = "loadPage",
  SlideIndex = "slideIndex",
  SlideInfiniteIndex = "slideInfiniteIndex",
  NumberOfSlides = "numberOfSlides",
  SliderWidth = "sliderWidth",
  SliderReady = "sliderReady",
  TransitionBypass = "transitionBypass",
  isStopSlider = "isStopSlider",
  isDragging = "isDragging",
  startPos = "startPos",
  prevTranslate = "prevTranslate",
  currentTranslate = "currentTranslate",
  animationID = "animationID",
  Autoplay = "autoplay",
  AutoplaySpeed = "autoplaySpeed",
  Dots = "dots",
  Arrows = "arrows",
  Touch = "touch",
  Infinite = "infinite",
  Speed = "speed",
  Mode = "mode",
  Transition = "transition",
  UseTailwind = "useTailwind"
}

interface StateType {
  [key: string]: string | number | boolean | null | undefined
  [State_Keys.RootSelector]: string | null
  [State_Keys.LoadPage]: boolean
  [State_Keys.SlideIndex]: number
  [State_Keys.SlideInfiniteIndex]: number
  [State_Keys.NumberOfSlides]: number
  [State_Keys.SliderWidth]: number
  [State_Keys.SliderReady]: boolean
  [State_Keys.TransitionBypass]: boolean
  [State_Keys.isStopSlider]: boolean
  [State_Keys.isDragging]: boolean
  [State_Keys.startPos]: number
  [State_Keys.prevTranslate]: number
  [State_Keys.currentTranslate]: number
  [State_Keys.Autoplay]: boolean
  [State_Keys.AutoplaySpeed]: number
  [State_Keys.Dots]: boolean
  [State_Keys.Arrows]: boolean
  [State_Keys.Touch]: boolean
  [State_Keys.Infinite]: boolean
  [State_Keys.Speed]: number
  [State_Keys.Mode]: string
  [State_Keys.Transition]: string
  [State_Keys.UseTailwind]: boolean
}

class BrickState {
  static state: { [key: string]: StateType } = {}
  private key: string

  constructor(key: string, options: IOptions = {}) {
    this.key = key
    if (!BrickState.state[key]) {
      BrickState.state[key] = {} as StateType
      this.initializeState(options)
    }
  }

  private initializeState(options: IOptions) {
    BrickState.state[this.key][State_Keys.RootSelector] = null
    BrickState.state[this.key][State_Keys.LoadPage] = true
    BrickState.state[this.key][State_Keys.SlideIndex] = 0
    BrickState.state[this.key][State_Keys.SlideInfiniteIndex] = 0
    BrickState.state[this.key][State_Keys.NumberOfSlides] = 0
    BrickState.state[this.key][State_Keys.SliderWidth] = 0
    BrickState.state[this.key][State_Keys.SliderReady] = true
    BrickState.state[this.key][State_Keys.TransitionBypass] = false
    BrickState.state[this.key][State_Keys.isStopSlider] = false
    BrickState.state[this.key][State_Keys.isDragging] = false
    BrickState.state[this.key][State_Keys.startPos] = 0
    BrickState.state[this.key][State_Keys.prevTranslate] = 0
    BrickState.state[this.key][State_Keys.currentTranslate] = 0
    BrickState.state[this.key][State_Keys.Autoplay] = options.autoplay ?? false
    BrickState.state[this.key][State_Keys.AutoplaySpeed] = options.autoplaySpeed ?? 3000
    BrickState.state[this.key][State_Keys.Dots] = options.dots ?? true
    BrickState.state[this.key][State_Keys.Arrows] = options.arrows ?? true
    BrickState.state[this.key][State_Keys.Touch] = options.touch ?? true
    BrickState.state[this.key][State_Keys.Infinite] = options.infinite ?? false
    BrickState.state[this.key][State_Keys.Speed] = options.speed ?? 300
    BrickState.state[this.key][State_Keys.Mode] = options.mode ?? "vertical"
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

  setOptions(options: IOptions): void {
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
