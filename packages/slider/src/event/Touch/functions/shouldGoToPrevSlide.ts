import { THRESHOLD_LIMIT } from "@/util/constants"

export function shouldGoToPrevSlide(moveSlider: number, currentIndex: number): boolean {
  const isMovedByThreshold = moveSlider > THRESHOLD_LIMIT
  const isNotFirstSlide = currentIndex > 0
  return isMovedByThreshold && isNotFirstSlide
}
