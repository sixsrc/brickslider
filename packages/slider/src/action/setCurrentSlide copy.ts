import { CLASS_VALUES, EVENTS, STYLES, TIMES, slideNodeList } from "../util/constants"
import { transform as transformSlider } from "../transition/transform"
import { addClass } from "../dom/methods/addClass"
import { setSlideIndex } from "./setSlideIndex"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "../core/functions/getChildren"
import { isFirstOrLast } from "@/core/functions/isFirstOrLast"
import { cancelWait, listener, waitFor } from "@/util"
import { matchStateOptions } from "@/util/matchStateOptions"
import { checkFirstSlideCloned } from "@/action/checkSlideCloned"
import { setStyle } from "@/dom/methods/setStyle"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"

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
  const { index, rootSelector } = params

  const state = new State(rootSelector)

  const $children = getChildren(rootSelector)

  const from = params.from!

  const slides = slideNodeList(rootSelector)

  slides.forEach((slide, index) => {
    isFirstOrLast(rootSelector, from!, slide, index)
  })

  const isStopSlider = state.get(State_Keys.isStopSlider)

  if (!isStopSlider) {
    const currentSlideIndex = state.get(State_Keys.SlideIndex)

    const slideIndex = setSlideIndex({
      from,
      currentSlideIndex,
      index
    })

    addClass([slides[slideIndex]], CLASS_VALUES.ACTIVE)

    state.set(State_Keys.SlideIndex, slideIndex)

    const animation = new RequestAnimationFrame(rootSelector)

    transformSlider(rootSelector)

    requestAnimationFrame(animation.init)

    const isSlideCloned = () => {
      checkFirstSlideCloned(rootSelector, slides)
    }

    const isInfinite = state.get(State_Keys.Infinite)

    if (index! <= 0) {
      /*const wait = waitFor(TIMES.DEFAULT_TRANSITION_TIME - 100, () => {
        setStyle($children, STYLES.TRANSITION, "")

        // matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, isSlideCloned)

        if (isInfinite) isSlideCloned()

        cancelWait(wait)
      })*/
    }
    if (index! >= 0) {
      listener(EVENTS.TRANSITIONSTART, $children, () => {
        // setStyle($children, STYLES.TRANSITION, "")

        //state.set(State_Keys.SliderReady, true)

        //if (isInfinite) isSlideCloned()

        const wait = waitFor(TIMES.DEFAULT_TRANSITION_TIME - 200, () => {
          setStyle($children, STYLES.TRANSITION, "")

          if (isInfinite) isSlideCloned()

          cancelWait(wait)
        })

        //matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, isSlideCloned)
      })
    }

    // return
  }

  state.setMultipleState({
    //[State_Keys.SliderReady]: true,
    [State_Keys.isStopSlider]: false
  })
}
