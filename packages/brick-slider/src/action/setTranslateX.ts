import { getChildren } from "@/dom/getChildren"
import { State, State_Keys } from "../state/BrickState"
import { calcTranslate } from "@/util"

export function setTranslateX(
  $root: string,
  currentTranslateFixedValue: number
): number {
  const state = new State($root)

  const $children = getChildren($root)

  const { slideIndex, slideSpacing } = state.store

  const translate = calcTranslate($children, slideSpacing, slideIndex),
    translateFixedValue = currentTranslateFixedValue!

  !currentTranslateFixedValue &&
    state.setMultipleState({
      [State_Keys.prevTranslate]: translate,
      [State_Keys.currentTranslate]: translate
    })

  return translateFixedValue ? translateFixedValue : translate
}
