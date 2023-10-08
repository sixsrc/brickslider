import { FROM } from "@/action/setCurrentSlide"
import { getAllElements } from "@/dom/methods/getAllElements"
import { hasClass } from "@/dom/methods/hasClass"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES, childrenSelector } from "@/util/constants"
import { getChildren } from "./getChildren"

export function isFirstOrLast(
  $root: string,
  from: string,
  slide: HTMLElement,
  index: number
): void {
  const state = new State($root)

  const slides = Array.from(
    getAllElements<HTMLElement>(`${childrenSelector} > *`, getChildren($root))
  )

  const isFirst = from === FROM.PREV && index === 0

  const isLast = from === FROM.NEXT && index === slides.length - 1

  if (hasClass(slide, CLASS_VALUES.ACTIVE)) {
    if (isFirst || isLast) state.set(State_Keys.isStopSlider, true)
    else if (!state.get(State_Keys.isStopSlider)) removeClass(slide, CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, index)
  }
}
