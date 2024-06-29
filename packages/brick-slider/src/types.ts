export type AnimationOptions = {
  duration: number
  easing?: string
  fill?: "none" | "forwards" | "backwards" | "both" | "auto"
  delay?: number
  iterations?: number
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse"
  endDelay?: number
  iterationStart?: number
}

export type TouchListenersParams = {
  element: HTMLElement
  index: number
  touchStart: any
  touchEnd: any
  touchMove: EventListener
}

export type TypeIndexBaseSliderdBy = {
  from: string
  slideIndex: number
  touchIndex?: number
}

type Directions = "right" | "left"

export type DirectionType = Partial<
  Record<Directions, boolean | undefined>
> | null

export type TupleIndexesType = [number, number, number, number]

export type TypeTargetSlideParams = {
  from: "next" | "prev" | "dots" | "touch"
  touchIndex?: number
  $root: string
}

export type SliderSpeedParams = {
  startX: number
  endX: number
  sliderWidth: number | undefined
  slideSpeed: number
}

export type UpdateSlideIndexType = "increment" | "decrement"

export type KeyframeAnimation = Record<string, any>
