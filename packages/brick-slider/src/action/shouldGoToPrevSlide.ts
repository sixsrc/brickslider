export function shouldGoToPrevSlide(
  moveSlider: number,
  currentIndex: number
): boolean {
  const isMovedByThreshold = moveSlider > 588 / 2
  const isNotFirstSlide = currentIndex > 0
  return isMovedByThreshold && isNotFirstSlide
}
