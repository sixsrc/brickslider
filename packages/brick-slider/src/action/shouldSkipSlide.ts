import { State } from "@/state/BrickState"
import { mathAbs } from "@/util"
import { goToCloned } from "@/action"

export function shouldSkipSlide($root: string, state: State): false | void {
  const { currentTranslate, sliderWidth, infinite } = state.store

  return (
    infinite &&
    mathAbs(currentTranslate) <= sliderWidth / 2 &&
    goToCloned($root, state)
  )
}
