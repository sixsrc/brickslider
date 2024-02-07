import { getElementAttribute } from "../../dom/methods/getElementAttribute"
import { ATTRIBUTES, EVENTS, STYLES, TRANSITIONS } from "../../util/constants"
import { FROM, setCurrentSlide } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { State, State_Keys } from "../../state/BrickState"
import { matchStateOptions } from "../../util/matchStateOptions"
import { cancelWait, listener, waitFor } from "../../util"
import { getChildren } from "../../core/functions/getChildren"
import { slideIndexBypass } from "@/core/functions/slideIndexBypass"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildrenCount } from "@/dom/methods/getChildrenCount"

export function handleClick(button: Element, $root: string): () => void {
  return () => {
    const state = new State($root)

    const isInfinite = state.get(State_Keys.Infinite)

    const $children = getChildren($root)

    listener(EVENTS.MOUSELEAVE, button, () =>
      setStyle($children, STYLES.TRANSITION, "")
    )

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)

    const isPrevDirection = getAttribute === FROM.PREV

    const isSliderReady = state.get(State_Keys.SliderReady)

    if (!isSliderReady) return

    state.set(State_Keys.SliderReady, false)

    setCurrentSlide({
      from: isPrevDirection ? FROM.PREV : FROM.NEXT,
      rootSelector: $root
    })

    const { slidesPerPage, slideIndex } = state.store

    const numberOfSlides = getChildrenCount($children)

    //const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 4

    const index = isInfinite
      ? slideIndexBypass(slideIndex, numberOfSlides, slidesPerPage)
      : slideIndex

    matchStateOptions($root, { [State_Keys.Dots]: true }, () => {
      updateDots(index, $root)
    })

    const wait = waitFor(100, () => {
      if (
        (isInfinite && index !== numberOfSlides - 1) ||
        (isInfinite && numberOfSlides !== 0)
      )
        state.set(State_Keys.SliderReady, true)

      cancelWait(wait)
    })

    listener(EVENTS.TRANSITIONEND, $children, () => {
      state.set(State_Keys.EndTime, Date.now())

      const { startTime, endTime, numberOfSlides } = state.store

      const isDefaultClick = Math.abs(startTime - endTime) >= 300

      if (
        isDefaultClick ||
        (!isInfinite && index > numberOfSlides - 1) ||
        (!isInfinite && numberOfSlides < 0)
      )
        setStyle($children, STYLES.TRANSITION, "")
    })
  }
}
