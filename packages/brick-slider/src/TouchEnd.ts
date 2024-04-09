import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { State_Keys } from "./State"
import { EVENTS } from "./constants"
import {
  addClass,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
  listener,
  removeClass,
  setIndexBypass,
  setStyle,
  transform,
  waitFor
} from "./helpers"

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  private sliderWidth: number
  animation: AnimationFrame
  private slider: Slider
  limitedMoveSlider: number

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
    this.animation = new AnimationFrame(this.$root)
    this.limitedMoveSlider = 0
  }

  public init = (event: TouchEvent | MouseEvent): void => {
    const {
      infinite,
      isJumpSlide,
      slideIndex,
      currentTranslate,
      prevTranslate
    } = this.store

    this.handleTouchMove(event)
    this.handleTransitionEnd()
    this.setState()
  }

  private handleTouchMove(event: TouchEvent | MouseEvent) {
    const {
      animationId,
      isMouseLeave,
      isTouch,
      currentTranslate,
      prevTranslate,
      infinite,
      slideIndex,
      isJumpSlide
    } = this.store
    //const teste = 2940 - (588 - Math.abs(currentTranslate))
    //const moveSlider = teste - 2940
    //this.state.set({
    // slideIndex: 5
    //})

    const moveSlider = currentTranslate - prevTranslate

    let currentIndex = this.store[State_Keys.SlideIndex]

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    const speed = this.moveTracker.stopTracking()

    console.log("speed", speed)

    //addClass([this.$children], "transition")

    this.goToNextSlide(moveSlider, currentIndex, this.slides) &&
      this.incrementSlideIndex()

    this.goToPrevSlide(moveSlider, currentIndex) && this.decrementSlideIndex()

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      //removeClass(this.$children, "transition-50")
      //([this.$children], "transition-400")

      addClass([this.$children], "transition")
    }

    listener([EVENTS.TRANSITIONSTART], this.$children, event => {
      setTimeout(() => {
        removeClass(this.$children, "transition")
      }, 300)
    })
  }

  private incrementSlideIndex(): void {
    this.state.set({ [State_Keys.SlideIndex]: this.store.slideIndex + 1 })
  }

  private decrementSlideIndex(): void {
    this.state.set({ [State_Keys.SlideIndex]: this.store.slideIndex - 1 })
  }

  private goToNextSlide(
    moveSlider: number,
    currentIndex: number,
    element: HTMLElement[]
  ): boolean {
    const isMovedByThreshold = moveSlider < (-this.sliderWidth * 20) / 100
    const isNotLastSlide = currentIndex < element.length - 1
    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    //removeClass(this.$children, "transition")
    // console.log("sempre passa aqui??")
    const isMovedByThreshold = moveSlider > (this.sliderWidth * 2) / 100
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  protected handleTransitionEnd(): void {
    const { currentTranslate, infinite } = this.store
    const firstSlide = getSliderNodeList(this.$root)[0]

    listener([EVENTS.TRANSITIONEND], this.$children, () => {
      //removeClass(this.$children, "transition")
      //console.log("event", event)
      if (Math.abs(this.store.currentTranslate) === 588) {
        /* removeClass(this.$children, "transition")

        this.state.set({
          currentTranslate: -2940,
          prevTranslate: -2940,
          slideIndex: 5,
          isJumpSlide: true
        })
        transform(this.$root)*/
      }
      /* if (infinite && hasClass(firstSlide, "active")) {
        this.state.set({
          slideIndex: 4,
          currentTranslate: -2352,
          prevTranslate: -2352
          //isJumpSlide: true
        })
        transform(this.$root)
      }*/
    })
  }

  protected setState() {
    this.state.set({
      [State_Keys.isDragging]: false,
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.IsTouch]: false,
      [State_Keys.EndTime]: new Date().getMilliseconds()
    })
  }

  private setPosition() {
    const { $root, sliderWidth } = this
    const { slideIndex, slidesPerPage, infinite, dots } = this.store

    const currentTranslate = slideIndex * -sliderWidth

    //removeClass(this.$children, "transition")

    const touchIndex = slideIndex

    this.state.set({
      [State_Keys.CurrentTranslate]: currentTranslate,
      [State_Keys.PrevTranslate]: currentTranslate
    })

    this.slider.setSlideTarget({
      from: "touch",
      touchIndex,
      $root
    })

    const index = infinite
      ? setIndexBypass(touchIndex, 6, slidesPerPage)
      : touchIndex

    if (dots) this.slider.updateDots(index, $root)
  }
}
