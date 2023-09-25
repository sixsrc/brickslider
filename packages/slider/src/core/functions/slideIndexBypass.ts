export function slideIndexBypass(displayedIndex: number, numberOfSlides: number) {
  const indexBypass =
    displayedIndex < 0
      ? numberOfSlides - 1
      : displayedIndex >= numberOfSlides
      ? displayedIndex
      : displayedIndex === numberOfSlides - 1
      ? 0
      : displayedIndex === 0
      ? numberOfSlides - 3
      : displayedIndex - 1

  return indexBypass
}
