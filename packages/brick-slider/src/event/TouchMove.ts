import { EVENTS, STYLES, TRANSITIONS } from "@/util/constants"
import { AnimationFrame } from "./AnimationFrame"
import { getAxisX } from "@/util/getAxisX"
import { eventX } from "@/util/eventX"
import { listener } from "@/util/listener"
import { transform as transformSlider } from "@/transition/transform"
import { State_Keys } from "@/state/BrickState"
import { waitFor } from "@/util/waitFor"
import { setStyle } from "@/dom/setStyle"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { stateUpdates } from "./constants"
import { toggleActiveClass } from "@/util/toggleActiveClass"
import { Slider } from "@/core/Slider"
import { Base } from "@/core/Base"

export class TouchMove extends Base {
  private slider: Slider
  private animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { isDragging } = this.store

    console.log("root", this.$root)

    if (isDragging) {
      this.handleEvents()
      this.setState(event)
      this.updateDOM()
    }
  }

  protected handleEvents(): void {
    const eventsArray = [EVENTS.TOUCHEND, EVENTS.MOUSEUP, EVENTS.MOUSELEAVE]

    listener(eventsArray, this.$children, () => {
      this.shouldSkipSlide()
    })
  }

  protected setState(event: Event) {
    const currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))
    const { prevTranslate, startPos } = this.store
    this.state.set({
      [State_Keys.IsTouch]: true,
      [State_Keys.CurrentTranslate]: prevTranslate + currentPosition - startPos
    })
  }

  protected updateDOM() {
    const currentTranslate = this.store[State_Keys.CurrentTranslate]

    transformSlider(this.$root, currentTranslate)

    requestAnimationFrame(this.animation.init)
  }

  private shouldSkipSlide(): false | void {
    const { currentTranslate, sliderWidth, infinite } = this.store

    return (
      infinite &&
      Math.abs(currentTranslate) <= sliderWidth / 2 &&
      this.executeNextUpdate(0)
    )
  }

  private executeNextUpdate(index: number): void {
    const { numberOfSlides, slidesPerPage, currentTranslate } = this.store

    const stateObj = stateUpdates(numberOfSlides, currentTranslate)

    if (index < stateObj.length) {
      this.state.set(stateObj[index])

      toggleActiveClass(
        getSlideNodeList(this.$root),
        numberOfSlides,
        slidesPerPage
      )

      Slider.updateDots(numberOfSlides - 1, this.$root)

      if (index === stateObj.length - 1) {
        setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
        transformSlider(this.$root, -2352)
        return
      }

      waitFor(0, () => this.executeNextUpdate(index + 1))
    }
  }
}

//const direction = currentPosition - startPos > 0 ? "right" : "left"
//console.log("Direction:", direction)
