import { getChildrenCount } from "@/dom/methods/getChildrenCount"
import { State, State_Keys } from "@/state/BrickState"
import { calcTranslate } from "@/util"

export function isLastSlideCloned($root: string, $children: HTMLElement): boolean {
  const state = new State($root)

  const transformValue = $children.style.transform

  const slideMargin = state.get(State_Keys.SlideMargin)

  const index = getChildrenCount($children)

  const translate = calcTranslate($children, slideMargin, index - 1)

  const translateStyle = `translate3d(${translate}px, 0px, 0px)`

  return transformValue.includes(translateStyle)
}
