import { setCurrentSlide } from "./setCurrentSlide"
import { State } from "../state/BrickState"
import { FROM, STYLES, TRANSITIONS } from "@/util/constants"
import { updateDots } from "./updateDots"
import { getChildren, setStyle } from "@/dom"

export function updateDotsHandler($root: string): void {
  const state = new State($root)
  let { infinite, slideIndex } = state.store
  const from = FROM.DOTS as never
  const $children = getChildren($root)

  updateDots(slideIndex, $root)

  setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

  setCurrentSlide({
    from,
    index: infinite ? ++slideIndex : slideIndex,
    $root
  })
}
