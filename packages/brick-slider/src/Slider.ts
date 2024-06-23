import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
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
  currentIndex: number
  translate: number
  recordedIndex: null | number

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentIndex = 0
    this.recordedIndex = 0
    this.translate = 0
  }

  public setSlideTarget(params: TypeTargetSlideParams): void {
    this.setIndexBasedBy(params)

    if (this.mapSlideIndex()) return

    this.animationFrame()
    this.calcTranslate()
    this.setState()
    this.updateDOM()
  }

  private setIndexBasedBy(params: TypeTargetSlideParams): void {
    let { touchIndex, from } = params!
    const { slideIndex, infinite } = this.store

    if (touchIndex !== undefined) {
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

  private isLastClonedSlide() {
    return this.currentIndex === this.recordedIndex
  }

  private animationFrame() {
    requestAnimationFrame(this.animation.init)
  }

  private calcTranslate() {
    const { spacing } = this.store

    this.translate = calcTranslate(this.$children!, spacing, this.currentIndex)
  }

  protected setState(): void {
    this.state.set({
      slideIndex: this.currentIndex,
      prevTranslate: this.translate,
      currentTranslate: this.translate
    })
  }

  protected updateDOM(): void {
    const { slidesPerPage } = this.store

    toggleClass(getSliderNodeList(this.$root), this.currentIndex, slidesPerPage)

    this.animate()
  }

  private animate(): void {
    animateElement(this.$children, this.keyFrames(), this.options())
  }

  private keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    const shouldJumpSlide = this.isLastClonedSlide()

    return [
      {
        transform: translate3d(currentTranslate, 0, 0)
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

//this.state.set({ [State_Keys.SlideIndex]: this.currentIndex })
/* {
        transform: translate3d(
          this.store.currentTranslate * this.currentIndex,
          0,
          0
        )
      }*/
