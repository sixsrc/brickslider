export function shouldGoToNextSlide(
  moveSlider: number,
  currentIndex: number,
  element: HTMLElement[]
): boolean {
  const isMovedByThreshold = moveSlider < -300
  const isNotLastSlide = currentIndex < element.length - 1
  return isMovedByThreshold && isNotLastSlide
}
