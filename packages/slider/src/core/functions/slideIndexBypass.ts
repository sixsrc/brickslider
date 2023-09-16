export function slideIndexBypass(displayedIndex: number, totalSlides: number) {
  /* if (displayedIndex < 0) {
    displayedIndex = totalSlides - 1
  } else if (displayedIndex >= totalSlides) {
    displayedIndex
  } else if (displayedIndex === totalSlides - 1) {
    return 0
  }
  
  return displayedIndex === 0 ? totalSlides - 3 : displayedIndex - 1*/

  const indexBypass =
    displayedIndex < 0
      ? totalSlides - 1
      : displayedIndex >= totalSlides
      ? displayedIndex
      : displayedIndex === totalSlides - 1
      ? 0
      : displayedIndex === 0
      ? totalSlides - 3
      : displayedIndex - 1

  return indexBypass
}
