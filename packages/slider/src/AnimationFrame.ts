import { BaseSlider } from "./BaseSlider"
import { Progress } from "./Progress"
import { ANIMATION_OPTIONS, EVENTS, TIMES } from "./helpers"
import { animateElement, prefersReducedMotion, translate3d } from "./helpers"
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
        const animations = this.animateTrack()

        this.syncProgress()
        this.runStartCallback(callbacks, animations)
        this.resolveWhenFinished(animations, callbacks, resolve)
      })
    })
  }

  private animateTrack(): Animation[] {
    return animateElement(this.$children, this.keyFrames(), this.options())
  }

  private syncProgress(): void {
    new Progress(this.$root).sync()
  }

  private runStartCallback(
    callbacks: AnimationCallbacks | undefined,
    animations: Animation[]
  ): void {
    if (!callbacks?.onStart) return

    queueMicrotask(() => {
      callbacks.onStart?.(animations)
    })
  }

  private resolveWhenFinished(
    animations: Animation[],
    callbacks: AnimationCallbacks | undefined,
    resolve: (animations: Animation[]) => void
  ): void {
    const finishedAnimations = animations.map(animation => animation.finished)

    Promise.all(finishedAnimations).then(() => {
      callbacks?.onEnd?.(animations)
      resolve(animations)
    })
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    return [{ transform: translate3d(currentTranslate) }]
  }

  protected options(
    time: number = TIMES.DEFAULT_TRANSITION_TIME
  ): AnimationOptions {
    const isDragFreeRelease = this.isDragFreeRelease()
    const duration = this.getAnimationDuration(time)
    const actualDuration = isDragFreeRelease
      ? TIMES.DRAG_FREE_RELEASE_TIME
      : this.normalizeDuration(duration)
    const easing = this.getAnimationEasing(isDragFreeRelease)

    return {
      duration: actualDuration,
      easing,
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }

  private getAnimationDuration(fallbackDuration: number): number {
    const { isFastNavigation, isJumpSlide, slidesPerPage } = this.store
    const shouldSkipDuration = this.isTouchMove() || isJumpSlide

    if (prefersReducedMotion()) return 0
    if (shouldSkipDuration) return 0

    return this.getPagedDuration(
      slidesPerPage,
      isFastNavigation,
      fallbackDuration
    )
  }

  private getAnimationEasing(isDragFreeRelease: boolean): string {
    if (isDragFreeRelease) return ANIMATION_OPTIONS.DRAG_FREE_EASING

    return ANIMATION_OPTIONS.EASEOUT
  }

  private isTouchMove(): boolean {
    return this.store.currentEventType === EVENTS.TOUCHMOVE
  }

  private isDragFreeRelease(): boolean {
    const { currentEventType, useDragFree } = this.store

    return useDragFree && currentEventType === EVENTS.TOUCHEND
  }

  private normalizeDuration(duration: number): number {
    return duration > 0 ? duration : 0
  }

  private getPagedDuration(
    slidesPerPage: number,
    isFastNavigation: boolean,
    fallbackDuration: number
  ): number {
    if (isFastNavigation && slidesPerPage > 1) {
      return TIMES.FAST_MULTI_PAGE_TRANSITION_TIME
    }

    if (isFastNavigation) return TIMES.FAST_TRANSITION_TIME
    if (slidesPerPage >= 3) return TIMES.LARGE_PAGE_TRANSITION_TIME
    if (slidesPerPage > 1) return TIMES.MULTI_PAGE_TRANSITION_TIME

    return fallbackDuration
  }
}
