import { transform as transformSlider } from "@/transition/transform"
//import { removeClass } from "@/dom/methods/removeClass"
import { State, State_Keys } from "@/state/BrickState"
import { STYLES, slideNodeList } from "@/util/constants"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { getChildren } from "@/core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"
import { setActiveClass } from "./setActiveClass"

export function setRealSlide(
  $root: string,
  clonedSlide: HTMLElement,
  jumpToIndex: number
) {
  const state = new State($root)

  const $children = getChildren($root)

  setStyle($children, STYLES.TRANSITION, "")

  state.set(State_Keys.SlideIndex, jumpToIndex)

  const animation = new RequestAnimationFrame($root)

  const slide = slideNodeList($root)

  const slideIndex = state.get(State_Keys.SlideIndex)

  const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  transformSlider($root)

  requestAnimationFrame(animation.init)

  //removeClass(clonedSlide, CLASS_VALUES.ACTIVE)
  setActiveClass(slide, slideIndex, slidesPerPage)

  state.set(State_Keys.isStopSlider, false)

  //state.set(State_Keys.SliderReady, true)
}
