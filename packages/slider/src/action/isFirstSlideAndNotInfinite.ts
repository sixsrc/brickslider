import { FROM } from "./setCurrentSlide";

export const isFirstSlideAndNotInfinite = (
  isInfinite: boolean,
  from: string,
  index: number
) => !isInfinite && from === FROM.PREV && index === 0;
