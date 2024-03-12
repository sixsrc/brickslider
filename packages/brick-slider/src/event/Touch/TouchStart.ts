import { State, State_Keys } from "../../state/BrickState"
import { AnimationFrame } from "./AnimationFrame"
import { adjustIndex } from "../../action/adjustIndex"
import { eventX, getPositionX } from "@/util"
import { getChildren, setStyle } from "@/dom"
import { STYLES } from "@/util/constants"

export class TouchStart {
  $root: string
  state: State
  animation: AnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State($root)
    this.animation = new AnimationFrame($root)
  }

  public init(index: number): (event: Event) => void {
    return (event: Event) => {
      const { $root, state, animation } = this

      const {
        slideIndex,
        slidesPerPage,
        numberOfSlides,
        infinite: isInfinite
      } = state.store

      const setEvent = eventX(event as MouseEvent | TouchEvent)

      const $children = getChildren($root)

      if (
        (isInfinite && slidesPerPage <= 1 && slideIndex <= 0) ||
        (isInfinite && slidesPerPage <= 1 && slideIndex >= numberOfSlides + 1)
      ) {
        //state.set(State_Keys.SliderReady, false)
      }

      // const isSliderReady = state.get(State_Keys.SliderReady)

      //if (!isSliderReady) return

      setStyle($children, STYLES.TRANSITION, "")

      const index2 = state.get(State_Keys.SlideIndex)

      console.log("index2", index2)

      state.setMultipleState({
        [State_Keys.StartTime]: new Date().getMilliseconds(),
        [State_Keys.SlideIndex]: adjustIndex(index2, slidesPerPage),
        [State_Keys.startPos]: getPositionX(setEvent),
        [State_Keys.isDragging]: true,
        [State_Keys.IsMouseLeave]: false,
        [State_Keys.IsJumpSlide]: false,
        [State_Keys.animationID]: requestAnimationFrame(animation.init)
      })
    }
  }
}
