import { FROM } from "./setCurrentSlide";

/*export function setSlideIndex(
  from: string,
  currentSlideIndex: number,
  index: number | undefined
): number {
  switch (from) {
    case FROM.NEXT:
      currentSlideIndex++;
      break;
    case FROM.PREV:
      currentSlideIndex--;
      break;
    case FROM.DOTS:
      currentSlideIndex = index ?? currentSlideIndex;
      break;
    default:
      break;
  }
  return currentSlideIndex;
}
*/

export function setSlideIndex(params: {
  from: string;
  currentSlideIndex: number;
  index?: number;
}): number {
  const { from, currentSlideIndex, index } = params;

  switch (from) {
    case FROM.NEXT:
      return currentSlideIndex + 1;
    case FROM.PREV:
      return currentSlideIndex - 1;
    case FROM.DOTS:
    case FROM.TOUCH:
      return index ?? currentSlideIndex;
    default:
      return currentSlideIndex;
  }
}
