import type { MouseEventOrTouchEvent } from "./types"

export const TOUCH_LIMIT = 0

export const MOVE_TO_LIMIT = 3

export const TOUCH_CONFIG = {
  FAST_SWIPE_MAX_MS: 180,
  FAST_VELOCITY_THRESHOLD: 0.35,
  SLOW_LIMIT: 35,
  MAX_LIMIT: 55,
  DRAG_FREE_SETTLE_FACTOR: 0.12
} as const

export const POSITION = {
  RIGHT: "right",
  LEFT: "left"
} as const

export function isPrimaryInputButton(event: MouseEventOrTouchEvent): boolean {
  if (event instanceof MouseEvent) {
    return event.button === 0
  }

  return true
}

export function getAxisX(event: MouseEventOrTouchEvent): number {
  if (event.type.includes("mouse")) {
    return (event as MouseEvent).pageX
  }

  if ((event as TouchEvent).touches && (event as TouchEvent).touches.length > 0) {
    return (event as TouchEvent).touches[0].clientX
  }

  return NaN
}
