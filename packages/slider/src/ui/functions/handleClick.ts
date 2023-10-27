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

    const isInfinite = state.get(State_Keys.Infinite)

    const $children = getChildren($root)

    listener(EVENTS.MOUSELEAVE, button, () =>
      setStyle($children, STYLES.TRANSITION, "")
    )

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)

    const isPrevDirection = getAttribute === FROM.PREV

    setCurrentSlide({
      from: isPrevDirection ? FROM.PREV : FROM.NEXT,
      rootSelector: $root
    })

    const { slidesPerPage, slideIndex } = state.store

    const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2

    const index =
      isInfinite && slidesPerPage <= 1
        ? slideIndexBypass(slideIndex, numberOfSlides)
        : slideIndex

    matchStateOptions($root, { [State_Keys.Dots]: true }, () => {
      updateDots(index, $root)
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
