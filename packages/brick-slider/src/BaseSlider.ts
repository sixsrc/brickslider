import { State, StateType } from "./State"
import { ANIMATION_OPTIONS } from "./constants"
import {
  animateElement,
  calcTranslate,
  eventX,
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

  constructor($root: string) {
    this.$root = $root
    this.getRootSelector = getRootSelector($root)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root) as HTMLElement
    this.getTrackChildren = getTrackChildren($root)
    this.childrenCount = getChildrenCount(this.$children)
    this.sliderWidth = getSliderWidth(this.$children)
  }

  protected defineTarget(event: MouseEventOrTouchEvent) {
    const element = event?.target as HTMLElement
    const rect = element?.getBoundingClientRect()

    const clientX = eventX(event).clientX

    return {
      clientX: () => clientX,
      rect: () => rect
    }
  }

  protected animate(
    keyFrames: KeyframeAnimation[],
    options: AnimationOptions
  ): void {
    animateElement(this.$children, keyFrames, options)
  }

  protected calcTranslate(index = this.store.slideIndex): number {
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

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [{ transform: translate3d(currentTranslate) }]
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }
}
