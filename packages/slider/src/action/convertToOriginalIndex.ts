export function convertToOriginalIndex(
  normalizedIndex: number,
  totalSlides: number
) {
  if (normalizedIndex === 0) {
    return totalSlides - 2 // Último slide real
  } else if (normalizedIndex === totalSlides - 1) {
    return 0 // Primeiro slide real
  } else {
    return normalizedIndex + 1 // Índice real
  }
}
