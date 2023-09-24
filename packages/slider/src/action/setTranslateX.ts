import { State, State_Keys } from "../state/BrickState"

export function setTranslateX($root: string, currentTranslateFromTouch?: number): number {
  const state = new State($root)
  const currentSlideIndex = state.get(State_Keys.SlideIndex)
  const childrenContainerWidth = state.get(State_Keys.SliderWidth)
  const currentTranslate = -childrenContainerWidth * currentSlideIndex

  !currentTranslateFromTouch &&
    state.setMultipleState({
      [State_Keys.prevTranslate]: currentTranslate,
      [State_Keys.currentTranslate]: currentTranslate
    })

  return currentTranslateFromTouch ? currentTranslateFromTouch : currentTranslate
}
