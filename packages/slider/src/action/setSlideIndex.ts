import { FROM } from "./setCurrentSlide"

export function setSlideIndex(params: {
  from: string
  currentSlideIndex: number
  index?: number
}): number {
  const { from, currentSlideIndex, index } = params

  switch (from) {
    case FROM.NEXT:
      return currentSlideIndex + 1
    case FROM.PREV:
      return currentSlideIndex - 1
    case FROM.DOTS:
    case FROM.TOUCH:
      return index ?? currentSlideIndex
    default:
      return currentSlideIndex
  }
}
