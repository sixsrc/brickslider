import { TOUCH_LIMIT } from "@/util/constants"

export function shouldGoToNextSlide(
  moveSlider: number,
  currentIndex: number,
  element: HTMLElement[]
): boolean {
  const isMovedByThreshold = moveSlider < -588 / 2
  const isNotLastSlide = currentIndex < element.length - 1
  console.log("moveSlider", moveSlider)
  return isMovedByThreshold && isNotLastSlide
}
