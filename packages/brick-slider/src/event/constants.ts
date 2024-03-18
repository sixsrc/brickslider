import { State_Keys } from "@/state/BrickState"

export const stateUpdates = (
  numberOfSlides: number,
  currentTranslate: number
) => [
  {
    [State_Keys.IsJumpSlide]: true,
    [State_Keys.SlideIndex]: numberOfSlides - 1,
    [State_Keys.CurrentTranslate]: -(Math.abs(currentTranslate) + 2352)
  },
  {
    [State_Keys.CurrentTranslate]: -2352,
    [State_Keys.PrevTranslate]: -2352
  }
]
