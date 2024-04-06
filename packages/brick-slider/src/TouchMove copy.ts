import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./constants"
import {
  addClass,
  calcTranslate,
  eventX,
  getAxisX,
  getSliderNodeList,
  hasClass,
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
    const { isDragging, slideIndex, currentTranslate } = this.store

    /* listener(
      [EVENTS.TRANSITIONEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP],
      this.$children,
      () => {
        if (Math.abs(event.clientX) >= 588 - (588 * 30) / 100) {
          removeClass(this.$children, "no-transition")
        }
      }
    )*/

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
    let { infinite, slideIndex, spacing, currentTranslate } = this.store

    const position = this.getPosition(event)

    if (infinite) {
      //console.log("aaa", Math.abs(currentTranslate) <= Math.abs(-328))

      //  console.log("aaaaa", Math.abs(this.store.currentTranslate))

      // valores diferenciados
      //3, 5, 10, 30
      //area de arraste muito curto colocar transicao pesada
      if (
        position.right() &&
        slideIndex === 1 &&
        Math.abs(this.store.currentTranslate) <= 588 - (588 * 3) / 100 //10 - 3- 30
      ) {
        this.skipSlide = true
        this.currentIndex = IndexesNames["Last"]

        ///addClass([this.$children], "no-transition")
      } /*else if (
        position.left() &&
        slideIndex === 4 &&
        !hasClass(this.slides[0], "cloned")
      ) {
        this.skipSlide = true
        this.currentIndex = IndexesNames["First"]
        //addClass([this.$children], "no-transition")
      } */ else if (slideIndex === 4 && hasClass(this.slides[4], "active")) {
        //addClass([this.$children], "no-transition")*/
      } else {
        /*else if (position.left() && slideIndex === 5) {
        this.skipSlide = true
        this.currentIndex = IndexesNames["Second"]
        //addClass([this.$children], "no-transition")
        //requestAnimationFrame(this.animation.init)
      }*/
        this.skipSlide = false

        //removeClass(this.$children, "no-transition")
      }
    }

    this.translate = calcTranslate(this.$children, spacing, this.currentIndex)

    if (this.skipSlide) {
      // removeClass(this.$children, "transition")
    }

    this.state.set(
      this.skipSlide ? this.infiniteTouchState() : this.mainTouchState()
    )
  }

  protected infiniteTouchState() {
    return {
      isJumpSlide: true,
      slideIndex: this.currentIndex,
      prevTranslate: this.translate
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

    if (this.skipSlide) {
      //this.skipSlide = false
      //removeClass(this.$children, "transition")
      // waitFor(0, () => addClass([this.$children], "transition"))
    }

    // waitFor(50, () => addClass([this.$children], "transition"))

    requestAnimationFrame(this.animation.init)

    transform(this.$root, currentTranslate)
  }
}
