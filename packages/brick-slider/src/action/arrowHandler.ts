import { ATTRIBUTES, EVENTS, STYLES, TRANSITIONS, FROM } from "@/util/constants"
import { updateDots } from "./updateDots"
import { State, State_Keys } from "../state/BrickState"
import {
  getChildren,
  getChildrenCount,
  getElementAttribute,
  setStyle
} from "@/dom"
import { listener, slideIndexBypass } from "@/util"
import { setCurrentSlide } from "@/action"

export function arrowHandler(button: Element, $root: string): () => void {
  return () => {
    const state = new State($root)
    const { slidesPerPage, slideIndex, infinite, dots } = state.store
    const $children = getChildren($root)
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const isPrevDirection = getAttribute === FROM.PREV

    listener([EVENTS.MOUSELEAVE], button, () =>
      setStyle($children, STYLES.TRANSITION, "")
    )

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    state.set("sliderReady", false)

    setCurrentSlide({
      from: isPrevDirection ? (FROM.PREV as never) : (FROM.NEXT as never),
      $root
    })

    const numberOfSlides = getChildrenCount($children)

    const index = infinite
      ? slideIndexBypass(slideIndex, numberOfSlides, slidesPerPage)
      : slideIndex

    if (dots) updateDots(index, $root)

    listener([EVENTS.TRANSITIONEND], $children, () => {
      state.set(State_Keys.EndTime, Date.now())

      const { startTime, endTime, numberOfSlides } = state.store
      const isDefaultClick = Math.abs(startTime - endTime) >= 300

      if (
        isDefaultClick ||
        (!infinite && index > numberOfSlides - 1) ||
        (!infinite && numberOfSlides < 0)
      )
        setStyle($children, STYLES.TRANSITION, "")
    })
  }
}

//if (!isSliderReady) return
// state.set(State_Keys.SliderReady, true)
