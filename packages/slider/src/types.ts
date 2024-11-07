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

export type Attributes = {
  "aria-label": string
  "aria-hidden": string
  "data-index": number
  role: string
}

export type CurrentEventType =
  | "dots"
  | "touchstart"
  | "touchmove"
  | "touchend"
  | "next"
  | "prev"
  | "contextmenu"
  | null

export type ContextMenuListenersParams = {
  element: HTMLElement
  rightClick: any
}

export type CurrentSlideMovement = "increment" | "decrement" | null

export type DragabbleListenersParams = {
  element: HTMLElement
  dragStart: any
}
export type EvalConditionsTouchMove = { [key: string]: boolean }

export type IndexMap = Record<IndexKey, IndexData>

export type IndexKey = "first" | "last"

export type IndexData = {
  currentIndex: IndexKey
  translate: number
}

export type invalidationConditions = {
  isPrevOrCurrent: boolean
  isNumber: boolean
  isNaNValue: boolean
}

export type MouseEventOrTouchEvent = TouchEvent | MouseEvent

export type PositionSlider = "right" | "left"

export type shouldInvalidateKey = { shouldInvalidate: boolean }

export type TouchListenersParams = {
  element: HTMLElement
  index: number
  touchStart: any
  touchEnd: any
  touchMove: EventListener
  // contextMenu: any
}

export type TypeIndexBaseSliderdBy = {
  from: string | null
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
