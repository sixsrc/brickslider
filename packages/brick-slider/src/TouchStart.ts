import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"

import {
  addClass,
  adjustIndex,
  eventX,
  getAxisX,
  removeClass,
  transform,
  waitFor
} from "./helpers"

export class TouchStart extends BaseSlider {
  private animation: AnimationFrame
  slides: any

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
  }

  public init(): (event: TouchEvent | MouseEvent) => void {
    return (event: TouchEvent | MouseEvent) => {
      const {
        slideIndex,
        infinite,
        startTime,
        endTime,
        currentTranslate,
        prevTranslate,
        isJumpSlide
      } = this.store
      const elapsedTime = startTime - endTime

      this.handleTouchStart()
      this.setState(event)
    }
  }
  private handleTouchStart() {
    const { slideIndex, isLoadPage, infinite, currentTranslate, isJumpSlide } =
      this.store

    //removeClass(this.$children, "pointer-events")

    //removeClass(this.$children, "transition")

    if (infinite)
      if (slideIndex === 1) {
        /* removeClass(this.$children, "transition")
        this.state.set({''''''''''
          slideIndex: 5,
          currentTranslate: -2940,
          prevTranslate: -2940,
          isJumpSlide: true
        })

        waitFor(100, () =>
          this.state.set({
            isJumpSlide: false
          })
        )
        return*/
      }
  }

  protected setState(event: TouchEvent | MouseEvent) {
    const setEvent = eventX(event as MouseEvent | TouchEvent)
    const { slidesPerPage, slideIndex, isJumpSlide, sliderReady } = this.store
    let eventNext = false
    if (slideIndex === 1 && !sliderReady) {
      waitFor(200, () => {
        this.state.set({
          sliderReady: false,
          currentTranslate: -1764,
          prevTranslate: -2352,
          slideIndex: 3
        })
      })
    }

    if (!sliderReady) return

    this.moveTracker.startTracking(event)

    this.state.set({
      [State_Keys.StartTime]: new Date().getMilliseconds(),
      [State_Keys.SlideIndex]: adjustIndex(slideIndex, slidesPerPage),
      [State_Keys.StartPos]: getAxisX(setEvent),
      [State_Keys.isDragging]: true,
      [State_Keys.IsMouseLeave]: false,
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
