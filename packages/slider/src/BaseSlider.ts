import { Center } from "./Center"
import { State, StateType } from "./State"
import { ANIMATION_OPTIONS } from "./constants"
import {
  animateElement,
  calcTranslate,
  getEventType,
  getChildren,
  getChildrenCount,
  getRootSelector,
  getSliderWidth,
  getTrackChildren,
  translate3d
} from "./helpers"
import {
  AnimationOptions,
  KeyframeAnimation,
  MouseEventOrTouchEvent
} from "./types"

export class BaseSlider {
  protected $root: string
  protected getRootSelector: HTMLElement | undefined
  protected state: State
  protected store: StateType
  protected $children: HTMLElement
  protected getTrackChildren: HTMLElement | any
  protected childrenCount: number
  protected sliderWidth: number | undefined
  protected movement: boolean
  protected dotIndex: number
  //protected center: any

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.getTrackChildren = getTrackChildren($root)
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
    this.movement = false
    this.dotIndex = 0
  }

  protected defineEventTarget(event: MouseEventOrTouchEvent) {
    const clientX = getEventType(event).clientX
    const clientY = getEventType(event).clientY

    return {
      clientX,
      clientY
    }
  }

  protected setDotsMovement() {
    const { currentSlideMovement: mov } = this.store

    mov === "increment" ? this.dotIndex++ : this.dotIndex--
  }

  protected isDotTarget(numberOfSlides: number) {
    if (this.dotIndex === -1) this.dotIndex = numberOfSlides - 1
    else if (this.dotIndex === numberOfSlides) this.dotIndex = 0
  }

  protected animate(
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): void {
    animateElement(this.$children, keyFrames, options)
  }

  protected calcTranslate(index: number): number {
    const { spacing } = this.store
    const { $children } = this

    return calcTranslate($children, spacing, index)
  }

  protected options(duration = 0): AnimationOptions {
    return {
      duration,
      easing: ANIMATION_OPTIONS.EASEOUT,
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }

  protected keyFrames(translate?: number): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      { transform: translate3d(translate ? translate : currentTranslate) }
    ]
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }
}
