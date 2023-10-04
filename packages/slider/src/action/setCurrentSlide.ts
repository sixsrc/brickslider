import { CLASS_VALUES, EVENTS, STYLES, TRANSITIONS, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
import { setStyle } from "@/dom/methods/setStyle"
import { hasClass } from "@/dom/methods/hasClass"
import { jumpSlideBypass } from "./jumpSlideBypass"
import { listener, waitFor } from "@/util"

export enum FROM {
  DOTS = "dots",
  PREV = "prev",
  NEXT = "next",
  TOUCH = "touch"
}

export function setCurrentSlide(
  params: {
    from?: FROM.DOTS | FROM.PREV | FROM.NEXT | FROM.TOUCH
    index?: number
    rootSelector: string
  } = {
    rootSelector: ""
  }
): void {
  const { from, index, rootSelector } = params

  const $children = getChildren(rootSelector)

  const state = new State(rootSelector)

  const isMouseLeave = state.get(State_Keys.IsMouseLeave)

  if (!isMouseLeave) setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

  const slides = slideNodeList(rootSelector)

  slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })

  const isStopSlider = state.get(State_Keys.isStopSlider)

  if (from && !isStopSlider) {
    const currentSlideIndex = state.get(State_Keys.SlideIndex)

    const slideIndex = setSlideIndex({
      from,
      currentSlideIndex,
      index
    })

    addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

    if (!state.get(State_Keys.SliderReady)) state.set(State_Keys.SliderReady, true)

    //setStyle($children, "pointer-events", "none")

    state.set(State_Keys.SlideIndex, slideIndex)

    const firstSlide = slideIndex <= 0

    const isCloned = hasClass(slides[slideIndex], CLASS_VALUES.CLONED)

    if (firstSlide && isCloned) {
      state.set(State_Keys.SliderReady, false)

      const wait = waitFor(200, () => jumpSlideBypass(rootSelector, $children, wait))
    } else {
      transformSlider(rootSelector)

      const releaseSliderCallback = () => {
        setStyle($children, STYLES.TRANSITION, "")

        state.set(State_Keys.SliderReady, true)
      }

      listener(EVENTS.TRANSITIONEND, $children, releaseSliderCallback)

      return
    }

    /*if (slideIndex <= 0 && hasClass(slides[slideIndex], CLASS_VALUES.CLONED)) {
      state.set(State_Keys.SliderReady, false)

      const wait = waitFor(200, () => {
        state.set(State_Keys.SlideIndex, state.get(State_Keys.NumberOfSlides))

        // setStyle($children, "pointer-events", "")

        setStyle($children, STYLES.TRANSITION, "")

        transformSlider(rootSelector)

        state.set(State_Keys.SliderReady, true)

        removeClass($children, CLASS_VALUES.ACTIVE)

        cancelWait(wait)
      })
    }*/
  }

  state.setMultipleState({
    [State_Keys.SliderReady]: true,
    [State_Keys.isStopSlider]: false
  })
}
