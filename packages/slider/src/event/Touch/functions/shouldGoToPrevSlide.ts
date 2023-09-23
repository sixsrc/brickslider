export function shouldGoToPrevSlide(moveSlider: number, currentIndex: number): boolean {
<<<<<<< HEAD
  const isMovedByThreshold = moveSlider > 300
=======
  const isMovedByThreshold = moveSlider > 100
>>>>>>> master
  const isNotFirstSlide = currentIndex > 0
  return isMovedByThreshold && isNotFirstSlide
}
