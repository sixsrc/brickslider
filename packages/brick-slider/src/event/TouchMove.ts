import { EVENTS, STYLES, TRANSITIONS } from "@/util/constants"
import { AnimationFrame } from "./AnimationFrame"
import { getPositionX } from "@/util/getPositionX"
import { getChildren } from "@/dom/getChildren"
import { eventX } from "@/util/eventX"
import { listener } from "@/util/listener"
import { transform as transformSlider } from "@/transition/transform"
import { State, StateType, State_Keys } from "@/state/BrickState"
import { waitFor } from "@/util/waitFor"
import { setStyle } from "@/dom/setStyle"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { stateUpdates } from "./constants"
import { setActiveClass } from "@/util/setActiveClass"
import { Slider } from "@/core/Slider"

export class TouchMove {
  public $root: string
  private $children: HTMLElement
  private slider: Slider
  private state: State
  private store: StateType
  private animation: AnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.slider = new Slider(this.$root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (event: Event): void => {
    const { isDragging } = this.store

    if (isDragging) {
      this.handleEvents()
      this.handleTouchMove()
    }
  }

  private handleEvents(): void {
    const eventsArray = [EVENTS.TOUCHEND, EVENTS.MOUSEUP, EVENTS.MOUSELEAVE]

    listener(eventsArray, this.$children, () => {
      this.shouldSkipSlide()
    })
  }

  private handleTouchMove(): void {
    const { prevTranslate, startPos } = this.store

    const currentPosition = getPositionX(
      eventX(event as MouseEvent | TouchEvent)
    )

    this.state.seti({
      [State_Keys.IsTouch]: true,
      [State_Keys.CurrentTranslate]: prevTranslate + currentPosition - startPos
    })

    const currentTranslate = this.state.store[State_Keys.CurrentTranslate]

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
      this.state.seti(stateObj[index])

      setActiveClass(
        getSlideNodeList(this.$root),
        numberOfSlides,
        slidesPerPage
      )

      this.slider.updateDots(numberOfSlides - 1, this.$root)

      if (index === stateObj.length - 1) {
        setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
        transformSlider(this.$root, -2352)
        return
      }

      waitFor(0, () => this.executeNextUpdate(index + 1))
    }
  }
}

/*
else {
        waitFor(TIMES.WITHOUT_TIMER, () => this.executeNextUpdate(index + 1))
      }
*/
//const direction = currentPosition - startPos > 0 ? "right" : "left"
//console.log("Direction:", direction)
