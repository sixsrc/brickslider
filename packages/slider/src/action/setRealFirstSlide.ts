import { transform } from "@/transition/transform"
import { updateSliderTransition } from "./updateSliderTransition"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES } from "@/util/constants"

export function setRealFirstSlide(rootSelector: string, childrenSelector: HTMLElement) {
  const state = new State(rootSelector)
  updateSliderTransition(rootSelector, "")
  state.set(State_Keys.SlideIndex, state.get(State_Keys.NumberOfSlides))
  transform(rootSelector)
  removeClass(childrenSelector, CLASS_VALUES.ACTIVE)
}
