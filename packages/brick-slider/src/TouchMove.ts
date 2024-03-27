import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"

import {
  adjustIndex,
  calcTranslate,
  eventX,
  getAxisX,
  transform
} from "./helpers"

export class TouchMove extends BaseSlider {
  private animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { isDragging } = this.store

    if (isDragging) {
      this.setState(event)
      this.updateDOM()
    }
  }

  protected setState(event: Event) {
    const currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))
    let {
      infinite,
      prevTranslate,
      currentTranslate,
      sliderWidth,
      slidesPerPage,
      startPos,
      spacing
    } = this.store

    const isHalfSwipe =
      infinite && Math.abs(currentTranslate) <= sliderWidth / 2

    let infiniteTouchState = {}

    const mainTouchState = {
      [State_Keys.IsTouch]: true,
      [State_Keys.CurrentTranslate]: prevTranslate + currentPosition - startPos,
      ...infiniteTouchState
    }

    const index = adjustIndex(this.childrenCount - 1, slidesPerPage)
    const translate = calcTranslate(
      this.$children,
      spacing,
      this.childrenCount - 1
    )

    infiniteTouchState = {
      [State_Keys.IsJumpSlide]: true,
      [State_Keys.SlideIndex]: index,
      [State_Keys.PrevTranslate]: translate,
      ...mainTouchState
    }

    this.state.set(isHalfSwipe ? infiniteTouchState : mainTouchState)
  }

  protected updateDOM() {
    const { currentTranslate } = this.store

    transform(this.$root, currentTranslate)

    requestAnimationFrame(this.animation.init)
  }
}
//<= //(sliderWidth * 10) / 100
//const direction = currentPosition - startPos > 0 ? "right" : "left"
//console.log("Direction:", direction)

/*

 private shouldSkipSlide(): false | void {
    const { currentTranslate, sliderWidth, slidesPerPage, infinite } =
      this.store

    const index = adjustIndex(this.childrenCount - 1, slidesPerPage)

    switch (true) {
      case infinite && Math.abs(currentTranslate) <= sliderWidth / 2:
        this.state.set({
          [State_Keys.IsJumpSlide]: true,
          [State_Keys.SlideIndex]: index
        })
    }
  }

*/
