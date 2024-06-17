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

export enum SpeedCategory {
  VERY_SLOW = 200,
  SLOW = 500,
  MODERATE = 1000,
  FAST = 2000,
  VERY_FAST = 5000
}
