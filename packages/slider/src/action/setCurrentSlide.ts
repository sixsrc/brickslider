import { CLASS_VALUES, TAGS } from "../util/constants";
import { transform as transformSlider } from "../transition/transform";
import { addClass } from "../dom/methods/addClass";
import { hasClass } from "../dom/methods/hasClass";
import { removeClass } from "../dom/methods/removeClass";
import { getAllElements } from "../dom/methods/getAllElements";
import { setSlideIndex } from "./setSlideIndex";
import { State, State_Keys } from "../state/BrickState";
import { getChildren } from "../core/functions/getChildren";
import { matchStateOptions } from "../util/matchStateOptions";

export enum FROM {
  DOTS = "dots",
  PREV = "prev",
  NEXT = "next",
  TOUCH = "touch",
}

export function setCurrentSlide(
  params: {
    from?: FROM.DOTS | FROM.PREV | FROM.NEXT | FROM.TOUCH;
    index?: number;
    rootSelector: string;
  } = {
    rootSelector: "",
  }
): void {
  const { from, index, rootSelector } = params,
    state = new State(rootSelector),
    // containerSliderWidth = state.get(State_Keys.SliderWidth),
    slider = getChildren(rootSelector),
    slides = Array.from(getAllElements<HTMLElement>(TAGS.DIV, slider));

  let currentSlideIndex = 0,
    shouldStopSlider = false;

  const isInfinite = matchStateOptions(rootSelector, {
    [State_Keys.Infinite]: true,
  });

  slides.forEach((slide, index) => {
    const [isFirstSlideAndNotInfinite, isLastSlideAndNotInfinite] = [
      !isInfinite && from === FROM.PREV && index === 0,
      !isInfinite && from === FROM.NEXT && index === slides.length - 1,
    ];

    switch (true) {
      case hasClass(slide, CLASS_VALUES.ACTIVE) &&
        (isFirstSlideAndNotInfinite || isLastSlideAndNotInfinite):
        shouldStopSlider = true;
        break;

      case hasClass(slide, CLASS_VALUES.ACTIVE) && !shouldStopSlider:
        currentSlideIndex = index;
        removeClass(slide, CLASS_VALUES.ACTIVE);
        break;

      default:
        break;
    }
  });

  if (!shouldStopSlider) {
    from &&
      (currentSlideIndex = setSlideIndex({
        from,
        currentSlideIndex,
        index,
      }));

    currentSlideIndex = (currentSlideIndex + slides.length) % slides.length;

    const currentSlide = slides[currentSlideIndex];
    state.set(State_Keys.SlideIndex, currentSlideIndex);

    addClass([currentSlide], CLASS_VALUES.ACTIVE);

    transformSlider(rootSelector);
  } else {
    state.set(State_Keys.SliderReady, true);
  }
}
