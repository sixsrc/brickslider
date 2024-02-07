import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { EVENTS, slideNodeList, STYLES, TRANSITIONS } from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { cancelWait, listener, waitFor } from "@/util"
import { checkSlideCloned } from "@/action/checkSlideCloned"

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

  public init = (): void => {
    const { $root, state, setPositionByIndex } = this

    state.set(State_Keys.isDragging, false)

    const {
      animationId,
      slideIndex,
      prevTranslate,
      startTime,
      endTime,
      isMouseLeave,
      numberOfSlides
    } = state.store

    state.set(State_Keys.EndTime, new Date().getMilliseconds())

    const $children = getChildren($root)

    const isInfinite = state.get(State_Keys.Infinite)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    /*const [isFirstInfiniteSlide, isLastInfiniteSlide] = [
      isInfinite && slidesPerPage <= 1 && slideIndex <= 0,
      isInfinite && slidesPerPage <= 1 && slideIndex >= numberOfSlides + 1
    ]*/

    const isClonedSlide = slideIndex === numberOfSlides - 1 || slideIndex <= 0

    const fastTouchSpeed = Math.abs(startTime - endTime) < 150

    const isAnimationIdNumber = typeof animationId === "number"

    function checkSlideCallback() {
      /* const wait =*/ waitFor(300, () => {
        checkSlideCloned($root)

        //cancelWait(wait)
      })
    }

    if (!isMouseLeave)
      setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    if (isAnimationIdNumber) cancelAnimationFrame(animationId)

    if (isInfinite && slidesPerPage <= 1)
      if (isClonedSlide)
        listener(EVENTS.TRANSITIONSTART, $children, () => checkSlideCallback())

    /* if (isFirstInfiniteSlide || isLastInfiniteSlide) {
     
    }*/

    const {
      currentTranslate: updatedCurrentTranslate,
      prevTranslate: updatedPrevTranslate
    } = state.store

    const moveSlider = updatedCurrentTranslate - updatedPrevTranslate

    let currentIndex = state.get(State_Keys.SlideIndex)

    if (fastTouchSpeed) {
      state.set(State_Keys.currentTranslate, prevTranslate)
    }

    if (currentIndex >= numberOfSlides - 1) {
      // state.set(State_Keys.currentTranslate, prevTranslate)
      // state.set(State_Keys.SlideIndex, numberOfSlides - 1)
    }

    const slides = slideNodeList($root)

    /* if (currentIndex < numberOfSlides - 1) {
    }*/

    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    if (!isMouseLeave) setPositionByIndex.init()

    listener(EVENTS.TRANSITIONEND, $children, () => {
      setStyle($children, STYLES.TRANSITION, "")
      state.set(State_Keys.SliderReady, true)
    })

    state.setMultipleState({
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.isTouch]: false
    })
  }
}
