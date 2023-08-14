export function adjustCurrentSlideIndex(
  currentSlideIndex: number,
  slides: HTMLElement[],
  isMatchingState: boolean
) {
  if (isMatchingState && currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  if (isMatchingState && currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (
    !isMatchingState &&
    (currentSlideIndex < 0 || currentSlideIndex >= slides.length)
  ) {
    return false;
  }

  return true;
}
