import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./constants"

import {
  addClass,
  calcTranslate,
  eventX,
  getAxisX,
  getSliderNodeList,
  listener,
  removeClass,
  transform,
  waitFor
} from "./helpers"

enum IndexesNames {
  First = 0,
  Second = 1,
  Third = 4,
  Last = 5
}

export class TouchMove extends BaseSlider {
  private animation: AnimationFrame
  private currentPosition: number
  private previousPosition: number
  private currentIndex: number
  private translate: number
  private slides: HTMLElement[]
  private skipSlide: boolean

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentPosition = 0
    this.previousPosition = 0
    this.currentIndex = 0
    this.translate = 0
    this.skipSlide = false
    this.slides = getSliderNodeList(this.$root)
  }

  public init = (event: Event): void => {
    const { isDragging, slideIndex, isJumpSlide } = this.store

    if (isDragging) {
      this.setState(event)
      this.getPosition(event)
      this.updateDOM(event)
    }
  }

  protected getPosition(event: Event) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))

    return {
      right: () => this.currentPosition > this.previousPosition,
      left: () => this.currentPosition < this.previousPosition
    }
  }

  protected setState(event: Event) {
    let { infinite, spacing, slideIndex, currentTranslate } = this.store

    const position = this.getPosition(event)
    // console.log(currentTranslate, event)

    // if (infinite && slideIndex == 5) return

    if (infinite)
      if (
        position.right() &&
        slideIndex === 1 &&
        Math.abs(this.store.currentTranslate) <= 588 - (588 * 1) / 100
      ) {
        //addClass([this.$track], "pointer-events")
        // this.skipSlide = true
        // this.currentIndex = IndexesNames["Last"]
        //waitFor(400, () => removeClass(this.$children, "pointer-events"))
      } else {
        // this.skipSlide = false
      }

    this.translate = calcTranslate(this.$children, spacing, this.currentIndex)

    this.state.set(
      this.skipSlide ? this.infiniteTouchState() : this.mainTouchState()
    )
  }

  protected infiniteTouchState() {
    const { prevTranslate, startPos } = this.store
    return {
      isJumpSlide: true,
      slideIndex: this.currentIndex,
      prevTranslate: this.translate
      //currentTranslate: this.translate + this.currentPosition - startPos
    }
  }

  protected mainTouchState() {
    const { prevTranslate, startPos } = this.store

    return {
      isTouch: true,
      currentTranslate: prevTranslate + this.currentPosition - startPos
    }
  }
  protected updateDOM(event: Event) {
    const { currentTranslate, isJumpSlide } = this.store

    //addClass([this.$children], "transition")

    // addClass([this.$children], "transition-50")

    // requestAnimationFrame(this.animation.init)

    //transform(this.$root, currentTranslate)
  }
}

// Math.abs(this.store.currentTranslate) <= 588 - (588 * 3) / 100 //10 - 3- 30*/

/*


      if (position.right() && slideIndex === 1) {
        this.skipSlide = true
        this.currentIndex = IndexesNames["Last"]
      } else if (
        position.right() &&
        slideIndex === 5 //&&
        //!hasClass(this.slides[0], "cloned")
      ) 
        this.skipSlide = false

        //removeClass(this.$children, "no-transition")
      }*/
