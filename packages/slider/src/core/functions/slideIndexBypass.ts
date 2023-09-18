export function slideIndexBypass(displayedIndex: number, totalSlides: number) {
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
