import { transform } from "@/transition/transform"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES /*, STYLES*/ } from "@/util/constants"
//import { setStyle } from "@/dom/methods/setStyle"

export function setRealFirstSlide($root: string, $children: HTMLElement) {
  const state = new State($root)

  state.set(State_Keys.SlideIndex, state.get(State_Keys.NumberOfSlides))

  transform($root)
  //setStyle($children, STYLES.TRANSITION, "")

  state.set(State_Keys.SliderReady, true)

  removeClass($children, CLASS_VALUES.ACTIVE)
}
