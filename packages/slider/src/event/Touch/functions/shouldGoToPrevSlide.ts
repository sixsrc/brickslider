export function shouldGoToPrevSlide(moveSlider: number, currentIndex: number): boolean {
  const isMovedByThreshold = moveSlider > 200
  const isNotFirstSlide = currentIndex > 0
  return isMovedByThreshold && isNotFirstSlide
}
