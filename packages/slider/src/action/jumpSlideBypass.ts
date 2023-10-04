import { removeClass } from "@/dom/methods/removeClass"
import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { cancelWait } from "@/util"
import { CLASS_VALUES, STYLES } from "@/util/constants"

export const jumpSlideBypass = ($root: string, $children: HTMLElement, wait: NodeJS.Timeout) => {
  const state = new State($root)

  state.set(State_Keys.SlideIndex, state.get(State_Keys.NumberOfSlides))

  setStyle($children, STYLES.TRANSITION, "")

  transformSlider($root)

  state.set(State_Keys.SliderReady, true)

  removeClass($children, CLASS_VALUES.ACTIVE)

  cancelWait(wait)
}
