import { transform as transformSlider } from "@/transition/transform"
import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { CLASS_VALUES } from "@/util/constants"
//import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"

export function setRealSlide($root: string, clonedSlide: HTMLElement, jumpToIndex: number) {
  const state = new State($root)

  state.set(State_Keys.SlideIndex, jumpToIndex)

  // const animation = new RequestAnimationFrame($root)

  transformSlider($root)

  //requestAnimationFrame(animation.init)

  removeClass(clonedSlide, CLASS_VALUES.ACTIVE)

  state.set(State_Keys.SliderReady, true)
}
