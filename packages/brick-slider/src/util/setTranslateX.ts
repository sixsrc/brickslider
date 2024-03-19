import { getChildren } from "@/dom/getChildren"
import { State, State_Keys } from "../state/BrickState"
import { calcTranslate } from "./calcTranslate"

export function setTranslateX(
  $root: string,
  currentTranslateFixedValue: number
): number {
  const state = new State($root)
  const $children = getChildren($root)
  const { slideIndex, spacing } = State.store($root)
  const translate = calcTranslate($children, spacing, slideIndex),
    translateFixedValue = currentTranslateFixedValue!

  !currentTranslateFixedValue &&
    state.set({
      [State_Keys.PrevTranslate]: translate,
      [State_Keys.CurrentTranslate]: translate
    })

  return translateFixedValue ? translateFixedValue : translate
}
