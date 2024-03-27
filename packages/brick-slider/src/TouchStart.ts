import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
import { STYLES } from "./constants"
import { adjustIndex, eventX, getAxisX, setStyle, waitFor } from "./helpers"

export class TouchStart extends BaseSlider {
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
    waitFor(50, () => setStyle(this.$children, STYLES.TRANSITION, ""))
  }

  protected setState(event: Event) {
    const setEvent = eventX(event as MouseEvent | TouchEvent)
    const { slidesPerPage, slideIndex } = this.store

    this.state.set({
      [State_Keys.StartTime]: new Date().getMilliseconds(),
      [State_Keys.SlideIndex]: adjustIndex(slideIndex, slidesPerPage),
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
