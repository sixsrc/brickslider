export function slideIndexBypass(displayedIndex: number, totalSlides: number) {
  if (displayedIndex < 0) {
    displayedIndex = totalSlides - 1 // Último slide real
  } else if (displayedIndex >= totalSlides) {
    displayedIndex = 0 // Primeiro slide real
  } else if (displayedIndex === totalSlides - 1) {
    return 0
  }
  return displayedIndex === 0 ? totalSlides - 3 : displayedIndex - 1
}
