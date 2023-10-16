import { getChildrenCount } from "@/dom/methods/getChildrenCount"
import { State, State_Keys } from "@/state/BrickState"
import { calcTranslate } from "@/util"

export function isFirstSlideCloned($root: string, $children: HTMLElement): boolean {
  const state = new State($root)

  const transformValue = $children.style.transform

  const slideSpacing = state.get(State_Keys.SlideSpacing)

  const index = getChildrenCount($children)

  const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  const translate = calcTranslate($children, slideSpacing, index - index)

  const translateStyle = `translate3d(${translate}px, 0px, 0px)`

  return transformValue.includes(translateStyle)
}
