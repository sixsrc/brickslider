import { transform as transformSlider } from "@/transition/transform"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES, STYLES } from "@/util/constants"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { getChildren } from "@/core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"

export function setRealSlide($root: string, clonedSlide: HTMLElement, jumpToIndex: number) {
  const state = new State($root)

  const $children = getChildren($root)

  setStyle($children, STYLES.TRANSITION, "")

  state.set(State_Keys.SlideIndex, jumpToIndex)

  const animation = new RequestAnimationFrame($root)

  transformSlider($root)

  requestAnimationFrame(animation.init)

  removeClass(clonedSlide, CLASS_VALUES.ACTIVE)

  state.set(State_Keys.isStopSlider, false)

  // state.set(State_Keys.SliderReady, true)

  //state.set(State_Keys.SliderReady, true)

  //setStyle($children, STYLES.TRANSITION, "")
}
