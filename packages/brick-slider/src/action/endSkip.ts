import { setStyle } from "@/dom"
import { State } from "@/state/BrickState"
import { transform as transformSlider } from "@/transition/transform"
import { STYLES, TRANSITIONS } from "@/util/constants"

export function endSkip(
  $root: string,
  $children: HTMLElement,
  state: State
): void {
  state.setMultipleState({
    currentTranslate: -2352,
    prevTranslate: -2352
  })
  const [transition, transform] = [
    STYLES.TRANSITION,
    TRANSITIONS.TRANSFORM_EASE
  ]

  setStyle($children, transition, transform)

  transformSlider($root, -2352)
}
