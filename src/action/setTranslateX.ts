import { State, State_Keys } from "../state/BrickState";

export function setTranslateX(
  rootSelector: string,
  currentTranslateFromTouch?: number
): number {
  const state = new State(rootSelector);
  const currentSlideIndex = state.get(State_Keys.SlideIndex);
  const childrenContainerWidth = state.get(State_Keys.SliderWidth);
  const currentTranslate = -childrenContainerWidth * currentSlideIndex;

  if (!currentTranslateFromTouch) {
    state.setMultipleState({
      [State_Keys.prevTranslate]: currentTranslate,
      [State_Keys.currentTranslate]: currentTranslate,
    });
  }

  return currentTranslateFromTouch
    ? currentTranslateFromTouch
    : currentTranslate;
}
