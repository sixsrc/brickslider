import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "../../state/BrickState"
import { shouldGoToNextSlide } from "./functions/shouldGoToNextSlide"
import { shouldGoToPrevSlide } from "./functions/shouldGoToPrevSlide"
import { SetPositionByIndex } from "./SetPositionByIndex"
import { EVENTS, slideNodeList, STYLES, /*TOUCH_LIMIT,*/ TRANSITIONS } from "@/util/constants"
import { getChildren } from "@/core/functions/getChildren"
import { RequestAnimationFrame } from "@/event/Touch/RequestAnimationFrame"
import { cancelWait, listener, waitFor } from "@/util"
import { checkSlide } from "@/action/checkSlide"

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

    const $children = getChildren($root)

    state.set(State_Keys.isDragging, false)

    const animationId = state.get(State_Keys.animationID)

    const isMouseLeave = state.get(State_Keys.IsMouseLeave)

    const isInfinite = state.get(State_Keys.Infinite)

    const slideIndex = state.get(State_Keys.SlideIndex)

    const isSliderReady = state.get(State_Keys.SliderReady)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const PrevTranslate = state.get(State_Keys.prevTranslate)

    const [startTime, endTime] = [state.get(State_Keys.StartTime), state.get(State_Keys.EndTime)]

    state.set(State_Keys.EndTime, new Date().getMilliseconds())

    // const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides)

    const checkSlideCallback = () => checkSlide(this.$root, isInfinite)

    //if(startTime - endTime)

    if (Math.abs(startTime - endTime) < 150) {
      //  cancelAnimationFrame(animationId)
      state.set(State_Keys.currentTranslate, PrevTranslate)
    }

    if (!isMouseLeave) setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    //listener(EVENTS.TRANSITIONEND, $children, checkSlideCallback)
    //checkSlide(this.$root, isInfinite)
    if ((isInfinite && slideIndex <= 0) || (isInfinite && slideIndex >= numberOfSlides + 1)) {
      const wait = waitFor(150, () => {
        checkSlide(this.$root, isInfinite)
        cancelWait(wait)
      })
    }

    //  listener(EVENTS.TRANSITIONEND, $children, checkSlideCallback)

    const moveSlider = state.get(State_Keys.currentTranslate) - state.get(State_Keys.prevTranslate)

    let currentIndex = state.get(State_Keys.SlideIndex)

    const slides = slideNodeList($root)

    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    setPositionByIndex.init()

    listener(EVENTS.TRANSITIONEND, $children, () => {
      state.set(State_Keys.SliderReady, true)
    })

    console.log(currentIndex)

    //isInfinite &&   currentIndex <= 0 || currentIndex >=
    // state.set(State_Keys.SliderReady, true)

    state.setMultipleState({
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.isTouch]: false
      // [State_Keys.prevTranslate]: state.get(State_Keys.currentTranslate)
    })
  }
}
