import { BaseSlider } from "./BaseSlider"
import { Progress } from "./Progress"
import { ANIMATION_OPTIONS, EVENTS, TIMES } from "./helpers"
import { animateElement, translate3d } from "./helpers"
import type {
  AnimationCallbacks,
  AnimationOptions,
  KeyframeAnimation
} from "./types"

export class AnimationFrame extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public init = (callbacks?: AnimationCallbacks): Promise<Animation[]> => {
    return new Promise(resolve => {
      requestAnimationFrame(() => {
        const animations = animateElement(
          this.$children,
          this.keyFrames(),
          this.options()
        )

        new Progress(this.$root).sync()

        if (callbacks?.onStart) {
          queueMicrotask(() => {
            callbacks.onStart?.(animations)
          })
        }

        const finishedAnimations = animations.map(anim => anim.finished)

        Promise.all(finishedAnimations).then(() => {
          callbacks?.onEnd?.(animations)
          resolve(animations)
        })
      })
    })
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    return [{ transform: translate3d(currentTranslate) }]
  }

  protected options(
    time: number = TIMES.DEFAULT_TRANSITION_TIME
  ): AnimationOptions {
    const { currentEventType, isJumpSlide, useDragFree } = this.store
    const isTouchMove = currentEventType === EVENTS.TOUCHMOVE
    const isDragFreeRelease =
      useDragFree && currentEventType === EVENTS.TOUCHEND
    const duration = isTouchMove || isJumpSlide ? 0 : time
    const actualDuration = isDragFreeRelease
      ? TIMES.DRAG_FREE_RELEASE_TIME
      : duration > 0
        ? duration
        : 0
    const easing = isDragFreeRelease
      ? ANIMATION_OPTIONS.DRAG_FREE_EASING
      : ANIMATION_OPTIONS.EASEOUT

    return {
      duration: actualDuration,
      easing,
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }
}
