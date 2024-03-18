import { getChildren } from "@/dom/getChildren"
import { AnimationFrame } from "./AnimationFrame"
import { EVENTS, STYLES, TRANSITIONS } from "@/util/constants"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { setStyle } from "@/dom/setStyle"
import { State, StateType, State_Keys } from "@/state/BrickState"
import { listener } from "@/util/listener"
import { setIndexBypass } from "@/util/setIndexBypass"
import { getSliderWidth } from "@/dom/getSliderWidth"
import { Slider } from "@/core/Slider"

export class TouchEnd {
  public $root: string
  private state: State
  private store: StateType
  private $children: HTMLElement
  private slides: HTMLElement[]
  private slider: Slider
  private sliderWidth: number
  animation: AnimationFrame

  constructor($root: string) {
    this.$root = $root
    this.$children = getChildren(this.$root)
    this.slides = getSlideNodeList(this.$root)
    this.slider = new Slider(this.$root)
    this.sliderWidth = getSliderWidth(this.$children)
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
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

    if (!isMouseLeave && !isJumpSlide)
      setStyle(this.$children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    if (typeof animationId === "number") cancelAnimationFrame(animationId)

    let currentIndex = this.state.get(State_Keys.SlideIndex)

    this.goToNextSlide(moveSlider, currentIndex, this.slides) &&
      this.incrementSlideIndex()

    this.goToPrevSlide(moveSlider, currentIndex) && this.decrementSlideIndex()

    if (!isMouseLeave && !isJumpSlide) this.setPosition()
  }

  private incrementSlideIndex(): void {
    const currentIndex = this.state.get(State_Keys.SlideIndex)
    this.state.seti({ [State_Keys.SlideIndex]: currentIndex + 1 })
  }

  private decrementSlideIndex(): void {
    const currentIndex = this.state.get(State_Keys.SlideIndex)
    this.state.seti({ [State_Keys.SlideIndex]: currentIndex - 1 })
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

  private handleTransitionEnd(): void {
    listener(EVENTS.TRANSITIONEND, this.$children, () =>
      setStyle(this.$children, STYLES.TRANSITION, "")
    )
  }

  private setState() {
    this.state.seti({
      [State_Keys.isDragging]: false,
      [State_Keys.IsMouseLeave]: true,
      [State_Keys.IsTouch]: false,
      [State_Keys.EndTime]: new Date().getMilliseconds()
    })
  }

  private setPosition() {
    const { state, $root, sliderWidth } = this
    const {
      slideIndex: currentIndex,
      slidesPerPage,
      infinite: isInfinite,
      dots
    } = this.store

    const currentTranslate = currentIndex * -sliderWidth

    state.setMultipleState({
      [State_Keys.CurrentTranslate]: currentTranslate,
      [State_Keys.PrevTranslate]: currentTranslate
    })

    const [index, from] = [currentIndex, "touch"]

    this.slider.setCurrentSlide({
      from: "touch",
      index,
      $root
    })

    const slideIndex = isInfinite
      ? setIndexBypass(index, 6, slidesPerPage)
      : index

    if (dots) this.slider.updateDots(slideIndex, $root)
  }
}

/*

event: Event

if (currentIndex >= numberOfSlides - 1) {
      // state.set(State_Keys.CurrentTranslate, updatedPrevTranslate)
      //state.set(State_Keys.SlideIndex, numberOfSlides - 1)
    }

    if (isInfinite && currentIndex <= 1) {
      // currentIndex = 0
      //console.log("currentIndex", currentIndex)
      // console.log("slideIndex", state.get(State_Keys.SlideIndex))
    }
*/
