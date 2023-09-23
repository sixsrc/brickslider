import { State, State_Keys } from "../state/BrickState"

export function setTranslateX(rootSelector: string, currentTranslateFromTouch?: number): number {
  const state = new State(rootSelector),
    currentSlideIndex = state.get(State_Keys.SlideIndex),
    childrenContainerWidth = state.get(State_Keys.SliderWidth),
    currentTranslate = -childrenContainerWidth * currentSlideIndex

  !currentTranslateFromTouch &&
    state.setMultipleState({
      [State_Keys.prevTranslate]: currentTranslate,
      [State_Keys.currentTranslate]: currentTranslate
    })

  return currentTranslateFromTouch ? currentTranslateFromTouch : currentTranslate
}
