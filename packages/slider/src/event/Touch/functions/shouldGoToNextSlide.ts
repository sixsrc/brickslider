export function shouldGoToNextSlide(
  moveSlider: number,
  currentIndex: number,
  element: HTMLElement[]
): boolean {
<<<<<<< HEAD
  const isMovedByThreshold = moveSlider < -300
=======
  const isMovedByThreshold = moveSlider < -100
>>>>>>> master
  const isNotLastSlide = currentIndex < element.length - 1
  return isMovedByThreshold && isNotLastSlide
}
