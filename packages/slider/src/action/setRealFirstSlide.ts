import { transform as transformSlider } from "@/transition/transform"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES } from "@/util/constants"

export function setRealFirstSlide($root: string, $children: HTMLElement) {
  const state = new State($root)

  state.set(State_Keys.SlideIndex, state.get(State_Keys.NumberOfSlides))

  transformSlider($root)

  state.set(State_Keys.SliderReady, true)

  removeClass($children, CLASS_VALUES.ACTIVE)
}
