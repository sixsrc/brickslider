import { AnimationFrame } from "./AnimationFrame"
import { EVENTS, STYLES, TRANSITIONS } from "@/util/constants"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { setStyle } from "@/dom/setStyle"
import { State_Keys } from "@/state/BrickState"
import { listener } from "@/util/listener"
import { setIndexBypass } from "@/util/setIndexBypass"
import { getSliderWidth } from "@/dom/getSliderWidth"
import { Slider } from "@/core/Slider"
import { Base } from "@/core/Base"

export class TouchEnd extends Base {
  private slides: HTMLElement[]
  private slider: Slider
  private sliderWidth: number
  animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.slides = getSlideNodeList(this.$root)
    this.slider = new Slider(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
    this.animation = new AnimationFrame(this.$root)
  }

  public init = (): void => {
    this.handleTouchMove()
    this.handleTransitionEnd()
    this.setState()
  }

  private handleTouchMove() {
    const {
      animationId,
      isJumpSlide,
      isMouseLeave,
      currentTranslate: updatedCurrentTranslate,
      prevTranslate: updatedPrevTranslate
    } = this.store

    const moveSlider = updatedCurrentTranslate - updatedPrevTranslate

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    let currentIndex = this.store[State_Keys.SlideIndex]

    this.goToNextSlide(moveSlider, currentIndex, this.slides) &&
      this.incrementSlideIndex()

    this.goToPrevSlide(moveSlider, currentIndex) && this.decrementSlideIndex()

    if (!isMouseLeave && !isJumpSlide) {
      setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
      this.setPosition()
    }
  }

  private incrementSlideIndex(): void {
    const currentIndex = this.store[State_Keys.SlideIndex]
    this.state.set({ [State_Keys.SlideIndex]: currentIndex + 1 })
  }

  private decrementSlideIndex(): void {
    const currentIndex = this.store[State_Keys.SlideIndex]
    this.state.set({ [State_Keys.SlideIndex]: currentIndex - 1 })
  }

  private goToNextSlide(
    moveSlider: number,
    currentIndex: number,
    element: HTMLElement[]
  ): boolean {
    const isMovedByThreshold = moveSlider < -588 / 2 /*-180*/
    const isNotLastSlide = currentIndex < element.length - 1
    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold = moveSlider > 588 / 2 /*  180*/
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  protected handleTransitionEnd(): void {
    listener(EVENTS.TRANSITIONEND, this.$children, () => {
      setStyle(this.$children, STYLES.TRANSITION, "")
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
    const {
      slideIndex: currentIndex,
      slidesPerPage,
      infinite: isInfinite,
      dots
    } = this.store

    const currentTranslate = currentIndex * -sliderWidth

    this.state.set({
      [State_Keys.CurrentTranslate]: currentTranslate,
      [State_Keys.PrevTranslate]: currentTranslate
    })

    const [touchIndex, from] = [currentIndex, "touch"]

    this.slider.setTargetSlide({
      from: "touch",
      touchIndex,
      $root
    })

    const slideIndex = isInfinite
      ? setIndexBypass(touchIndex, 6, slidesPerPage)
      : touchIndex

    if (dots) Slider.updateDots(slideIndex, $root)
  }
}
