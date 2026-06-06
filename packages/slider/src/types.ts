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

export type SlideDatasetAttributes = {
  "data-index": number
  "data-slide-number": number
}

export type CurrentEventType =
  | "loadDOM"
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
  isUndefined: boolean
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

export type getMissingSlides = {
  isMissing: boolean
  leftOver: number
}

export type TypeTargetSlideParams = {
  from: "next" | "prev" | "dots" | "touchend"
  touchIndex?: number
  $root: string
}

export type UpdateSlideIndexType = "increment" | "decrement"

export type KeyframeAnimation = Record<string, any>
