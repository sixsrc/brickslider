import { CLASS_VALUES, TAGS } from "../util/constants";
import { transform as transformSlider } from "../transition/transform";
import { addClass } from "../dom/methods/addClass";
import { hasClass } from "../dom/methods/hasClass";
import { removeClass } from "../dom/methods/removeClass";
import { getAllElements } from "../dom/methods/getAllElements";
import { setSlideIndex } from "./setSlideIndex";
import { State, State_Keys } from "../state/BrickState";
import { getChildren } from "../core/functions/getChildren";

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
    containerSliderWidth = state.get(State_Keys.SliderWidth),
    slider = getChildren(rootSelector),
    slides = Array.from(getAllElements<HTMLElement>(TAGS.DIV, slider));

  let currentSlideIndex = 0;

  slides.forEach((slide, index) => {
    if (hasClass(slide, CLASS_VALUES.ACTIVE)) {
      currentSlideIndex = index;
      removeClass(slide, CLASS_VALUES.ACTIVE);
    }
  });

  if (from)
    currentSlideIndex = setSlideIndex({
      from,
      currentSlideIndex,
      index,
    });

  if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
  else if (currentSlideIndex >= slides.length) currentSlideIndex = 0;

  const currentSlide = slides[currentSlideIndex];

  addClass([currentSlide], CLASS_VALUES.ACTIVE);

  state.set(State_Keys.SlideIndex, currentSlideIndex);

  if (containerSliderWidth) transformSlider(rootSelector);
}
