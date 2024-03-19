import { State_Keys } from "@/state/BrickState"
import { AnimationFrame } from "./AnimationFrame"
import { STYLES } from "@/util/constants"
import { eventX } from "@/util/eventX"
import { setStyle } from "@/dom/setStyle"
import { adjustIndex } from "@/util/adjustIndex"
import { getAxisX } from "@/util/getAxisX"
import { Base } from "@/core/Base"

export class TouchStart extends Base {
  private animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
  }

  public init(): (event: Event) => void {
    return (event: Event) => {
      this.handleTouchStart()
      this.setState(event)
    }
  }
  private handleTouchStart() {
    setStyle(this.$children, STYLES.TRANSITION, "")
  }

  protected setState(event: Event) {
    const setEvent = eventX(event as MouseEvent | TouchEvent)
    const index = this.store[State_Keys.SlideIndex]
    const { slidesPerPage } = this.store

    this.state.set({
      [State_Keys.StartTime]: new Date().getMilliseconds(),
      [State_Keys.SlideIndex]: adjustIndex(index, slidesPerPage),
      [State_Keys.StartPos]: getAxisX(setEvent),
      [State_Keys.isDragging]: true,
      [State_Keys.IsMouseLeave]: false,
      [State_Keys.IsJumpSlide]: false,
      [State_Keys.AnimationID]: requestAnimationFrame(this.animation.init)
    })
  }
}

/*

index: number
   if (
        (isInfinite && slidesPerPage <= 1 && slideIndex <= 0) ||
        (isInfinite && slidesPerPage <= 1 && slideIndex >= numberOfSlides + 1)
      ) {
        //state.set(State_Keys.SliderReady, false)
      }

      // const isSliderReady = state.get(State_Keys.SliderReady)

      //if (!isSliderReady) return

*/
