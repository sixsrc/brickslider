import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import {
  EVENTS,
  eventX,
  slideNodeList,
  STYLES,
  TRANSITIONS
} from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { listener, waitFor } from "@/util"
import { checkSlideCloned } from "@/action/checkSlideCloned"
import { transform as transformSlider } from "@/transition/transform"
import { getPositionX } from "./functions/getPositionX"

export class TouchEnd {
  $root: string
  state: State
  setPositionByIndex: SetPositionByIndex
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.setPositionByIndex = new SetPositionByIndex(this.$root)
    this.animation = new RequestAnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { $root, state, setPositionByIndex } = this

    const setEvent = eventX(event as MouseEvent | TouchEvent)

    const currentPosition = getPositionX(setEvent)

    // const startPos = state.get(State_Keys.startPos)

    state.set(State_Keys.isDragging, false)

    const {
      animationId,
      slideIndex,
      prevTranslate,
      startTime,
      endTime,
      startPos,
      isJumpSlide,
      slidesPerPage,
      isMouseLeave,
      numberOfSlides
    } = state.store

    state.set(State_Keys.EndTime, new Date().getMilliseconds())

    const $children = getChildren($root)

    const isInfinite = state.get(State_Keys.Infinite)

    // const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const isClonedSlide = slideIndex === numberOfSlides - 1 || slideIndex <= 0

    //const isFastTouch = Math.abs(startTime - endTime) < 500

    //console.log(Math.abs(startTime - endTime))

    const isAnimationIdNumber = typeof animationId === "number"

    /*function checkSlideCallback() {
      waitFor(300, () => {
        checkSlideCloned($root)
      })
    }*/

    if (!isMouseLeave)
      setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    if (isAnimationIdNumber) cancelAnimationFrame(animationId)

    if (isInfinite && slidesPerPage <= 1)
      if (isClonedSlide) {
      }
    // listener(EVENTS.TRANSITIONSTART, $children, () => checkSlideCallback())

    const {
      currentTranslate: updatedCurrentTranslate,
      prevTranslate: updatedPrevTranslate
    } = state.store

    const moveSlider = updatedCurrentTranslate - updatedPrevTranslate

    let currentIndex = state.get(State_Keys.SlideIndex)

    /*if (isFastTouch) {
      //state.set(State_Keys.currentTranslate, prevTranslate)
      //state.set(State_Keys.SliderReady, false)
      // waitFor(80, () => state.set(State_Keys.SliderReady, true))
    }*/

    if (currentIndex >= numberOfSlides - 1) {
      // state.set(State_Keys.currentTranslate, prevTranslate)
      // state.set(State_Keys.SlideIndex, numberOfSlides - 1)
    }

    const slides = slideNodeList($root)

    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    if (!isMouseLeave && !isJumpSlide) setPositionByIndex.init()

    listener(EVENTS.TRANSITIONEND, $children, () => {
      setStyle($children, STYLES.TRANSITION, "")
      // state.set(State_Keys.SliderReady, true)
    })

    state.setMultipleState({
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.isTouch]: false
    })
  }
}
