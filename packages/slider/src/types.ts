export type AnimationCondition = {
  c: boolean
  k: KeyframeAnimation[]
}

export type AnimationOptions = {
  duration?: number
  easing?: string
  fill?: "none" | "forwards" | "backwards" | "both" | "auto"
  delay?: number
  iterations?: number
  direction?: "normal" | "reverse" | "alternate" | "alternate-reverse"
  endDelay?: number
  iterationStart?: number
}

export type CurrentEventType =
  | "dots"
  | "dragstart"
  | "touchmove"
  | "touchend"
  | "next"
  | "prev"
  | null

export type DragabbleListenersParams = {
  element: HTMLElement
  dragStart: any
}
export type EvalConditionsTouchMove = { [key: string]: boolean }

export type IndexMap = Record<IndexKey, IndexData>

export type IndexKey = "first" | "second" | "last"

export type IndexData = {
  currentIndex: Capitalize<IndexKey> | "Third"
  translate: number
}

export type MouseEventOrTouchEvent = TouchEvent | MouseEvent

export type PositionSlider = "right" | "left"

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

export type EventFrom = "dots" | "touch" | "next" | "prev" | null

export type TypeTargetSlideParams = {
  //from: "next" | "prev" | "dots" | "touch"
  touchIndex?: number
  $root: string
}

export type UpdateSlideIndexType = "increment" | "decrement"

export type KeyframeAnimation = Record<string, any>
