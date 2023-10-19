import { State, State_Keys } from "../../state/BrickState"
import { transform as transformSlider } from "../../transition/transform"
import { getPositionX } from "./functions/getPositionX"
import { RequestAnimationFrame } from "./RequestAnimationFrame"
import { eventX } from "@/util/constants"

export class TouchMove {
  $root: string
  state: State
  animation: RequestAnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.state = new State(this.$root)
    this.animation = new RequestAnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { state, $root, animation } = this

    const setEvent = eventX(event as MouseEvent | TouchEvent)

    const isDragging = state.get(State_Keys.isDragging)

    const currentPosition = getPositionX(setEvent)

    const prevTranslate = state.get(State_Keys.prevTranslate)

    const startPos = state.get(State_Keys.startPos)

    // const slideIndex = state.get(State_Keys.SlideIndex)

    const isInfinite = state.get(State_Keys.Infinite)

    const isSliderReady = state.get(State_Keys.SliderReady)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    // if (isInfinite && slideIndex <= 0 && slidesPerPage <= 1)
    /// if (!isSliderReady) return
    //state.set(State_Keys.SliderReady, false)

    if (isDragging) {
      state.setMultipleState({
        [State_Keys.isTouch]: true,
        [State_Keys.currentTranslate]: prevTranslate + currentPosition - startPos
      })

      const setCurrentTranslate = state.get(State_Keys.currentTranslate)

      transformSlider($root, setCurrentTranslate)

      requestAnimationFrame(animation.init)
    }
  }
}
