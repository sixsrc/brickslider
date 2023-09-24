import { getElementAttribute } from "../../dom/methods/getElementAttribute"
import { ATTRIBUTES, EVENTS, STYLES, TRANSITIONS, slideNodeList } from "../../util/constants"
import { FROM, setCurrentSlide } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { State, State_Keys } from "../../state/BrickState"
import { matchStateOptions } from "../../util/matchStateOptions"
import { listener } from "../../util"
import { getChildren } from "../../core/functions/getChildren"
import { slideIndexBypass } from "@/core/functions/slideIndexBypass"
import { setStyle } from "@/dom/methods/setStyle"
import { checkFirstSlideCloned } from "@/event/Touch/functions/checkFirstSlideCloned"

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

      const setActiveDot = () => {
        updateDots(slideIndex, $root)
      }

      matchStateOptions($root, { [State_Keys.Dots]: true }, setActiveDot)

      listener(EVENTS.TRANSITIONEND, $children, () => {
        state.set(State_Keys.SliderReady, true)
      })

      /*listener(EVENTS.TRANSITIONEND, $children, () => {
        matchStateOptions($root, { [State_Keys.Infinite]: true }, () => {
          checkFirstSlideCloned($root, slideNodeList($root))
        })

        state.set(State_Keys.SliderReady, true)

        setStyle($children, STYLES.TRANSITION, "")
      })*/
    }
  }
}
