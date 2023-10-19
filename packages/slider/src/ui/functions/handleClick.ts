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

    // const isStopSlider = state.get(State_Keys.isStopSlider)

    const $children = getChildren($root)

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    // if (isStopSlider) return

    //state.set(State_Keys.isStopSlider, true)

    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)

    const isPrevDirection = getAttribute === FROM.PREV

    setCurrentSlide({
      from: isPrevDirection ? FROM.PREV : FROM.NEXT,
      rootSelector: $root
    })

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const index = state.get(State_Keys.SlideIndex)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2

    const slideIndex =
      isInfinite && slidesPerPage <= 1 ? slideIndexBypass(index, numberOfSlides) : index

    matchStateOptions($root, { [State_Keys.Dots]: true }, () => {
      updateDots(slideIndex, $root)
    })

    listener(EVENTS.TRANSITIONEND, $children, () => {
      state.set(State_Keys.EndTime, Date.now())

      const [startTime, endTime] = [state.get(State_Keys.StartTime), state.get(State_Keys.EndTime)]

      const timePerClick = Math.abs(startTime - endTime)

      const numberOfSlides = state.get(State_Keys.NumberOfSlides)

      console.log(timePerClick)

      if (timePerClick >= 300) {
        setStyle($children, STYLES.TRANSITION, "")
      }

      if ((!isInfinite && slideIndex > numberOfSlides - 1) || (!isInfinite && numberOfSlides < 0)) {
        setStyle($children, STYLES.TRANSITION, "")
      }
    })

    listener(EVENTS.MOUSELEAVE, button, () => setStyle($children, STYLES.TRANSITION, ""))
  }
}
