import { TOUCH_LIMIT } from "@/util/constants"

export function shouldGoToNextSlide(
  moveSlider: number,
  currentIndex: number,
  element: HTMLElement[]
): boolean {
  const isMovedByThreshold = moveSlider < -TOUCH_LIMIT
  const isNotLastSlide = currentIndex < element.length - 1
  return isMovedByThreshold && isNotLastSlide
}
