import { setStyle } from "@/dom"
import { State } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { STYLES, TRANSITIONS } from "@/util/constants"

export function endSlideJumpingAction(
  $root: string,
  $children: HTMLElement,
  state: State
) {
  state.setMultipleState({
    currentTranslate: -2352,
    prevTranslate: -2352
  })
  setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
  transformSlider($root, -2352)
}
