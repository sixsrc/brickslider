import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { ANIMATION_OPTIONS, CLASS_VALUES, TAGS } from "./constants"
import {
  addClass,
  animateElement,
  calcTranslate,
  getAllElements,
  getDotsSelector,
  getSliderNodeList,
  hasClass,
  indexBasedBy,
  isNotMapped,
  removeClass,
  toggleClass,
  translate3d
} from "./helpers"
import {
  AnimationOptions,
  KeyframeAnimation,
  TypeTargetSlideParams
} from "./types"

export class Slider extends BaseSlider {
  private animation: any
  private currentIndex: number
  private translate: number
  private from: TypeTargetSlideParams["from"] | null

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.translate = 0
    this.from = null
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    this.setIndexBasedBy(params)

    if (this.mapSlideIndex()) return

    this.animationFrame()
    this.calcTranslate()
    this.setState(this.mainState())
    this.updateDOM()
  }

  private setIndexBasedBy(params: TypeTargetSlideParams): void {
    const { slideIndex, infinite } = this.store

    let { touchIndex, from } = params!

    this.from = from

    if (touchIndex !== undefined) {
      const { from } = this

      if (infinite && from === "dots") {
        touchIndex = touchIndex + 1
      }
    }

    this.currentIndex = indexBasedBy({
      from,
      slideIndex,
      touchIndex
    })
  }

  private mapSlideIndex(): boolean {
    const { infinite, numberOfSlides } = this.store

    return isNotMapped(infinite, this.currentIndex, numberOfSlides)
  }

  private animationFrame() {
    requestAnimationFrame(this.animation.init)
  }

  private calcTranslate() {
    const { spacing } = this.store
    const { $children, currentIndex } = this

    this.translate = calcTranslate($children!, spacing, currentIndex)
  }

  private mainState(): Partial<StateType> {
    const { currentIndex, translate } = this

    return {
      slideIndex: currentIndex,
      prevTranslate: translate,
      currentTranslate: translate
    }
  }

  protected setState(state: Partial<StateType>): void {
    this.state.set(state)
  }

  protected updateDOM(): void {
    const { slidesPerPage } = this.store
    const { $root, currentIndex } = this

    toggleClass(getSliderNodeList($root), currentIndex, slidesPerPage)

    this.animate()
  }

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store

    return [
      {
        transform: translate3d(currentTranslate)
      }
    ]
  }

  private options(): AnimationOptions {
    return {
      duration: 0,
      easing: ANIMATION_OPTIONS.EASEOUT
    }
  }

  public updateDots(index: number, $root: string): void {
    const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector($root))
    const selectedIndex = index ?? 0

    dots.forEach((dot, i) => {
      if (hasClass(dot, CLASS_VALUES.SELECTED))
        removeClass(dot, CLASS_VALUES.SELECTED)

      if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
    })
  }
}
