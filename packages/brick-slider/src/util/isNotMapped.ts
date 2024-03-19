export function isNotMapped(
  infinite: boolean,
  currentIndex: number,
  numberOfSlides: number
): boolean {
  switch (true) {
    case !infinite && currentIndex > numberOfSlides - 1:
      return false
    case !infinite && currentIndex < 0:
      return false
    case currentIndex > currentIndex + 1:
      currentIndex = currentIndex - 1
      break
    case currentIndex < 0:
      currentIndex = currentIndex + 1
      break
  }

  return true
}
