import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"

import {
  calcTranslate,
  eventX,
  getAxisX,
  getSliderNodeList,
  transform
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
    const { isDragging } = this.store

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
    let { infinite, spacing, slideIndex } = this.store

    const position = this.getPosition(event)

    /*if (infinite)
      if (
        position.right() &&
        slideIndex === 1 &&
        Math.abs(this.store.currentTranslate) <= 588 - (588 * 0.1) / 100
      ) {
        // this.skipSlide = true
        // this.currentIndex = IndexesNames["Last"]
      } else {
        this.skipSlide = false
      }*/

    this.translate = calcTranslate(this.$children, spacing, this.currentIndex)

    this.state.set(
      this.skipSlide ? this.infiniteTouchState() : this.mainTouchState()
    )
  }

  protected infiniteTouchState() {
    return {
      isJumpSlide: false,
      slideIndex: this.currentIndex,
      prevTranslate: this.translate
    }
  }

  protected mainTouchState() {
    const { prevTranslate, startPos } = this.store

    return {
      isJumpSlide: true,
      isTouch: true,
      currentTranslate: prevTranslate + this.currentPosition - startPos
    }
  }
  protected updateDOM(event: Event) {
    const { currentTranslate, isJumpSlide } = this.store

    if (!isJumpSlide) {
      requestAnimationFrame(this.animation.init)
      transform(this.$root, currentTranslate)
    }
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
