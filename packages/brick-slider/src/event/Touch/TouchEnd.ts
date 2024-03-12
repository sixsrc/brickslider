import { State, State_Keys } from "../../state/BrickState"
import { SetPosition } from "./SetPosition"
import { AnimationFrame } from "@/event/Touch/AnimationFrame"
import { listener, slideNodeList } from "@/util"
import { shouldGoToNextSlide, shouldGoToPrevSlide } from "@/action"
import { getChildren, setStyle } from "@/dom"
import { EVENTS, STYLES, TRANSITIONS } from "@/util/constants"

export class TouchEnd {
  $root: string
  state: State
  setPosition: SetPosition
  animation: AnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.setPosition = new SetPosition(this.$root)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { $root, state, setPosition } = this

    // const setEvent = eventX(event as MouseEvent | TouchEvent),
    const $children = getChildren($root)

    const {
      animationId,
      isJumpSlide,
      isMouseLeave,
      numberOfSlides,
      infinite: isInfinite,
      currentTranslate: updatedCurrentTranslate,
      prevTranslate: updatedPrevTranslate
    } = state.store

    const slides = slideNodeList($root)

    const moveSlider = updatedCurrentTranslate - updatedPrevTranslate

    if (!isMouseLeave && !isJumpSlide)
      setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    let currentIndex = state.get(State_Keys.SlideIndex)

    if (currentIndex >= numberOfSlides - 1) {
      // state.set(State_Keys.currentTranslate, updatedPrevTranslate)
      //state.set(State_Keys.SlideIndex, numberOfSlides - 1)
    }

    if (isInfinite && currentIndex <= 1) {
      // currentIndex = 0
      //console.log("currentIndex", currentIndex)
      // console.log("slideIndex", state.get(State_Keys.SlideIndex))
    }
    shouldGoToNextSlide(moveSlider, currentIndex, slides) &&
      state.set(State_Keys.SlideIndex, (currentIndex += 1))

    shouldGoToPrevSlide(moveSlider, currentIndex) &&
      state.set(State_Keys.SlideIndex, (currentIndex -= 1))

    if (!isMouseLeave && !isJumpSlide) setPosition.init()

    listener(EVENTS.TRANSITIONEND, $children, () =>
      setStyle($children, STYLES.TRANSITION, "")
    )

    state.setMultipleState({
      [State_Keys.isDragging]: false,
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.isTouch]: false,
      [State_Keys.EndTime]: new Date().getMilliseconds()
    })
  }
}
