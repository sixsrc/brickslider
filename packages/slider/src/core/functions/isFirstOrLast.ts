import { FROM } from "@/action/setCurrentSlide"
import { getAllElements } from "@/dom/methods/getAllElements"
import { hasClass } from "@/dom/methods/hasClass"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES, childrenSelector } from "@/util/constants"
import { getChildren } from "./getChildren"

export function isFirstOrLast(
  rootSelector: string,
  from: string,
  slide: HTMLElement,
  index: number
): void {
  const state = new State(rootSelector),
    slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, getChildren(rootSelector))
    )
  const [isFirst, isLast] = [
    from === FROM.PREV && index === 0,
    from === FROM.NEXT && index === slides.length - 1
  ]

  if (hasClass(slide, CLASS_VALUES.ACTIVE)) {
    if (isFirst || isLast) state.set(State_Keys.isStopSlider, true)
    else if (!state.get(State_Keys.isStopSlider)) removeClass(slide, CLASS_VALUES.ACTIVE)
    state.set(State_Keys.SlideIndex, index)
  }
}
