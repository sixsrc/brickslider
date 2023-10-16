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

    const isStopSlider = state.get(State_Keys.isStopSlider)

    // if (isStopSlider) return

    //state.set(State_Keys.isStopSlider, true)

    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)

    const isPrevDirection = getAttribute === FROM.PREV

    const $children = getChildren($root)

    const isSliderReady = state.get(State_Keys.SliderReady)

    //console.log("index", state.get(State_Keys.SliderReady))

    //if (!isSliderReady) return

    //state.set(State_Keys.SliderReady, false)

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    /*if (!isInfinite) {
      if (state.get(State_Keys.SlideIndex) >= numberOfSlides - 1) {
        // updateDots(slideIndex, $root)
        state.set(State_Keys.isStopSlider, true)
        //
        // state.set(State_Keys.SlideIndex, state.get(State_Keys.SlideIndex) - 1)
      } else if (state.get(State_Keys.SlideIndex) < numberOfSlides - 1) {
        state.set(State_Keys.isStopSlider, false)
        //
      }
    }*/

    setCurrentSlide({
      from: isPrevDirection ? FROM.PREV : FROM.NEXT,
      rootSelector: $root
    })

    //state.set(State_Keys.SliderReady, false)

    //state.set(State_Keys.isStopSlider, false)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const index = state.get(State_Keys.SlideIndex)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides) + 2

    const slideIndex =
      isInfinite && slidesPerPage <= 1 ? slideIndexBypass(index, numberOfSlides) : index

    matchStateOptions($root, { [State_Keys.Dots]: true }, () => {
      updateDots(slideIndex, $root)
    })

    listener(EVENTS.TRANSITIONEND, $children, () => {
      // state.set(State_Keys.SliderReady, true)
    })
  }
}
