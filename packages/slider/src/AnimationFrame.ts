import { BaseSlider } from "./BaseSlider"
import { ANIMATION_OPTIONS, EVENTS, TIMES } from "./constants"
import { animateElement, translate3d } from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

type AnimationCallbacks = {
  onStart?: (animations: Animation[]) => void
  onEnd?: (animations: Animation[]) => void
}

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

        // 🔹 Aciona o callback onStart imediatamente após criar as animações
        if (callbacks?.onStart) {
          // Aguarda um microtask para garantir que as animações estejam prontas
          queueMicrotask(() => {
            callbacks.onStart?.(animations)
          })
        }

        const finishedAnimations = animations.map(anim => anim.finished)

        Promise.all(finishedAnimations).then(() => {
          // 🔹 Aciona o callback onEnd, se existir
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
    const { currentEventType, isJumpSlide } = this.store
    const isTouchMove = currentEventType === EVENTS.TOUCHMOVE
    const duration = isTouchMove || isJumpSlide ? 0 : time
    const actualDuration = duration > 0 ? duration : 0

    return {
      duration: actualDuration,
      easing: "ease",
      fill: ANIMATION_OPTIONS.FORWARDS
    }
  }
}

/*public init = (): number => {
    const animationId = requestAnimationFrame(() => {
      this.animate(this.$children, this.keyFrames(), this.options())
    })

    return animationId
  }*/
