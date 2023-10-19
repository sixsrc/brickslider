import { EVENTS, eventX, STYLES } from "@/util/constants"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"
import { adjustSlideIndex } from "./functions/adjustSlideIndex"
import { checkSlide } from "@/action/checkSlide"
import { cancelWait, listener, waitFor } from "@/util"

export class TouchStart {
  $root: string
  state: State
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    this.animation = new RequestAnimationFrame($root)
  }

  public init(index: number): (event: Event) => void {
    return (event: Event) => {
      const { state, animation } = this

      const setEvent = eventX(event as MouseEvent | TouchEvent)

      const $children = getChildren(this.$root)

      const isInfinite = state.get(State_Keys.Infinite)

      const slideIndex = state.get(State_Keys.SlideIndex)

      //retirar

      const slidesPerPage = state.get(State_Keys.SlidesPerPage)

      const numberOfSlides = state.get(State_Keys.NumberOfSlides)
      const checkSlideCallback = () => checkSlide(this.$root, isInfinite)

      if ((isInfinite && slideIndex <= 0) || (isInfinite && slideIndex >= numberOfSlides + 1)) {
      //  state.set(State_Keys.SliderReady, false)
        //checkSlide(this.$root, isInfinite)
        //listener(EVENTS.TRANSITIONEND, $children, checkSlideCallback)
        // const wait = waitFor(100, checkSlideCallback)
        // cancelWait(wait)
        // checkSlide(this.$root, isInfinite)
      }

      const isSliderReady = state.get(State_Keys.SliderReady)

      if (!isSliderReady) return

      setStyle($children, STYLES.TRANSITION, "")

      state.setMultipleState({
        [State_Keys.StartTime]: new Date().getMilliseconds(),
        [State_Keys.SlideIndex]: adjustSlideIndex(index, slidesPerPage),
        [State_Keys.startPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.IsMouseLeave]: false,
        [State_Keys.animationID]: requestAnimationFrame(animation.init)
      })
    }
  }
}
