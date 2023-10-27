import { eventX, STYLES } from "@/util/constants"
import { State, State_Keys } from "../../state/BrickState"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { setStyle } from "@/dom/methods/setStyle"
import { getChildren } from "@/core/functions/getChildren"
import { adjustSlideIndex } from "./functions/adjustSlideIndex"

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

      console.log("touchstart")

      const setEvent = eventX(event as MouseEvent | TouchEvent)

      const $children = getChildren(this.$root)

      const isInfinite = state.get(State_Keys.Infinite)

      const slideIndex = state.get(State_Keys.SlideIndex)

      const slidesPerPage = state.get(State_Keys.SlidesPerPage)

      const numberOfSlides = state.get(State_Keys.NumberOfSlides)

      if (
        (isInfinite && slidesPerPage <= 1 && slideIndex <= 0) ||
        (isInfinite && slidesPerPage <= 1 && slideIndex >= numberOfSlides + 1)
      ) {
        state.set(State_Keys.SliderReady, false)
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
