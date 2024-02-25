import { TOUCH_LIMIT } from "@/util/constants"

export function shouldGoToPrevSlide(
  moveSlider: number,
  currentIndex: number
): boolean {
  const isMovedByThreshold = moveSlider > 588 / 2
  const isNotFirstSlide = currentIndex > 0
  console.log("moveSlider", moveSlider)
  return isMovedByThreshold && isNotFirstSlide
}
