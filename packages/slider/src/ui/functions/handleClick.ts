import { getElementAttribute } from "../../dom/methods/getElementAttribute"
import { ATTRIBUTES, EVENTS, STYLES, TRANSITIONS } from "../../util/constants"
import { FROM, setCurrentSlide } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { State, State_Keys } from "../../state/BrickState"
import { matchStateOptions } from "../../util/matchStateOptions"
import { listener } from "../../util"
import { getChildren } from "../../core/functions/getChildren"
import { slideIndexBypass } from "@/core/functions/slideIndexBypass"
import { setStyle } from "@/dom/methods/setStyle"

export function handleClick(button: Element, $root: string): () => void {
  return () => {
    const state = new State($root)
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const isPrevDirection = getAttribute === FROM.PREV

    if (state.get(State_Keys.SliderReady)) {
      state.set(State_Keys.SliderReady, false)

      const $children = getChildren($root)

      setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

      setCurrentSlide({
        from: isPrevDirection ? FROM.PREV : FROM.NEXT,
        rootSelector: $root
      })

      const isInfinite = state.get(State_Keys.Infinite)
      const index = state.get(State_Keys.SlideIndex)
      const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2
      const slideIndex = isInfinite ? slideIndexBypass(index, numberOfSlides) : index

      matchStateOptions($root, { [State_Keys.Dots]: true }, () => {
        updateDots(slideIndex, $root)
      })

      listener(EVENTS.TRANSITIONEND, $children, () => {
        state.set(State_Keys.SliderReady, true)
      })
    }
  }
}
