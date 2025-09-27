import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { CLASS_VALUES, EVENTS, TIMES, TOUCH_LIMIT } from "./constants"
import { getSliderNodeList, hasClass, translate3d, waitFor } from "./helpers"
import {
  CurrentSlideMovement,
  KeyframeAnimation,
  UpdateSlideIndexType
} from "./types"

export class TouchEnd extends BaseSlider {
  private slides: HTMLElement[]
  protected animation: AnimationFrame
  private slider: Slider
  private moveSlider: number
  private isFastInteraction: boolean

  constructor($root: string) {
    super($root)
    this.slider = new Slider(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.animation = new AnimationFrame(this.$root)
    this.moveSlider = 0
    this.isFastInteraction = false
  }

  public init = (event: any): void => {
    this.nextAction(event)
  }

  private nextAction(event: any): void {
    const target = this.shouldBeEqual(event) as string
    const isNotSwipe = this.shouldNotBeSwipe()
    const isEqual = this.shouldBeEqual(event)

    if (isNotSwipe) return
    if (isEqual) this.setTargetCondition()[target]
    else this.action()
  }

  private shouldBeEqual(event?: any): string | undefined {
    const isEqual = Object.keys(this.evalSwipeConditions(event)).find(
      key => this.evalSwipeConditions(event)[key]
    )
    return isEqual
  }

  protected shouldNotBeSwipe(): boolean {
    const { currentEventType } = this.store
    return currentEventType !== "touchmove"
  }

  private evalSwipeConditions(event: any): Partial<StateType> {
    const isMouseLeave = event.type === "mouseleave"
    return {
      FIRST: isMouseLeave
    }
  }

  private setTargetCondition(): Record<any, any> {
    return {
      FIRST: waitFor(100, () => this.action()),
      SECOND: waitFor(0, () => this.action())
    }
  }

  protected action(): void {
    this.setState(this.eventTargetState())
    this.handleTouchMove()
    this.setState(this.mainState())
  }

  private mainState(): Partial<StateType> {
    return {
      endTime: new Date().getMilliseconds(),
      isDragging: false,
      isMouseLeave: true,
      isTouch: false
    }
  }

  private handleTouchMove(): void {
    const {
      isMouseLeave,
      isTouch,
      slideIndex,
      currentTranslate,
      prevTranslate
    } = this.store

    this.moveSlider = currentTranslate - prevTranslate
    this.setState(this.prevSlideState(slideIndex))

    const { isNext, isPrev } = this.actionsMove()

    if (isNext || isPrev) {
      this.updateSlideIndex(isNext ? "increment" : "decrement")
      this.movement = true
    } else {
      this.setState({ currentSlideMovement: null })
    }

    if (isTouch && !isMouseLeave) {
      this.setPosition()
      this.cancelAnimationFrame()
      this.movement = false
    }
  }

  private actionsMove() {
    const { slideIndex } = this.store
    const { moveSlider, slides } = this
    const isNext = this.goToNextSlide(moveSlider, slideIndex, slides)
    const isPrev = this.goToPrevSlide(moveSlider, slideIndex)
    return { isNext, isPrev }
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { currentTranslate } = this.store
    return [{ transform: translate3d(currentTranslate) }]
  }

  protected getSpeedInteraction() {
    const { startTime, endTime } = this.store
    return Math.abs(startTime - endTime)
  }

  private cancelAnimationFrame(): void {
    const { animationId } = this.store
    if (typeof animationId === "number") {
      cancelAnimationFrame(animationId)
    }
  }

  private updateSlideIndex(action: UpdateSlideIndexType): void {
    const incrementOrDecrement = this.incrementOrDecrementState(action)
    const currentSlideMovement = this.slideMovementState(action)
    const objState = { ...incrementOrDecrement, ...currentSlideMovement }
    const { slideIndex, slidesPerPage } = { ...this.store, ...objState }
    objState.activePage = Math.floor(slideIndex / slidesPerPage)
    this.setState(objState)
  }

  private slideMovementState(action: CurrentSlideMovement): Partial<StateType> {
    return { currentSlideMovement: action }
  }

  /** ALTERAÇÃO: agora avança/decrementa por slidesPerPage (páginas) */
  /* private incrementOrDecrementState(
    action: UpdateSlideIndexType
  ): Partial<StateType> {
    const { slideIndex, slidesPerPage } = this.store
    const step = slidesPerPage || 1
    console.log("step", slideIndex, this.slider.currentIndex)
    return action === "increment"
      ? { slideIndex: (slideIndex || 0) + step }
      : { slideIndex: (slideIndex || 0) - step }
  }*/

  /*private incrementOrDecrementState(
    action: UpdateSlideIndexType
  ): Partial<StateType> {
    const { slideIndex, slidesPerPage, slidesPerView } = this.store
    const step = slidesPerPage || 1
    const totalSlides = this.slides.length
    const view = slidesPerView || 1
    const maxStartIndex = Math.max(totalSlides - view, 0)

    let nextIndex =
      action === "increment"
        ? (slideIndex || 0) + step
        : (slideIndex || 0) - step

    // clamp para não sair dos limites
    if (nextIndex > maxStartIndex) nextIndex = maxStartIndex
    if (nextIndex < 0) nextIndex = 0

    return { slideIndex: nextIndex }
  }*/

  private incrementOrDecrementState(
    action: UpdateSlideIndexType
  ): Partial<StateType> {
    const { slideIndex, slidesPerPage, slidesPerView, leftOverSlides } =
      this.store
    const step = slidesPerPage || 1
    const totalSlides = this.slides.length
    const view = slidesPerView || 1
    const maxStartIndex = Math.max(totalSlides - view, 0)
    let nextIndex = 0
    const lastGroupStep = this.getLastGroupStep(
      totalSlides,
      slidesPerView,
      slidesPerPage
    )
    const hasIncompleteGroup = lastGroupStep < slidesPerView

    if (
      action === "decrement" &&
      hasIncompleteGroup &&
      slideIndex === maxStartIndex
    ) {
      nextIndex = slideIndex - lastGroupStep
    } else {
      // comportamento padrão
      nextIndex =
        action === "increment"
          ? (slideIndex || 0) + step
          : (slideIndex || 0) - step
    }

    // clamp para não ultrapassar limites
    if (nextIndex > maxStartIndex) nextIndex = maxStartIndex
    if (nextIndex < 0) nextIndex = 0

    return { slideIndex: nextIndex }
  }

  private goToNextSlide(
    moveSlider: number,
    currentIndex: number,
    element: HTMLElement[]
  ): boolean {
    const isMovedByThreshold =
      moveSlider < (-this.sliderWidth! * TOUCH_LIMIT) / 100

    const isNotLastSlide = currentIndex < element.length - 1

    return isMovedByThreshold && isNotLastSlide
  }

  private goToPrevSlide(moveSlider: number, currentIndex: number): boolean {
    const isMovedByThreshold =
      moveSlider > (this.sliderWidth! * TOUCH_LIMIT) / 100
    const isNotFirstSlide = currentIndex > 0
    return isMovedByThreshold && isNotFirstSlide
  }

  private setPosition() {
    const {
      slideIndex,
      currentSlideMovement: mov,
      currentTranslate,
      prevTranslate
    } = this.store
    // calcTranslate agora usa store.slideIndex internamente (BaseSlider.calcTranslate)
    const translate = this.calcTranslate()

    this.setState({
      currentTranslate: -translate,
      prevTranslate: -translate
    })

    this.slider.setSlideTarget({
      from: "touchend",
      touchIndex: slideIndex,
      $root: this.$root
    })

    if (mov) {
      // Se houve movimento, atualizamos para o translate calculado para o slideIndex atual
    } else {
      // Sem movimento - anima de volta (reset)
      /* this.setState({
        currentTranslate: prevTranslate,
        prevTranslate
      })

      this.animate(
        this.$children,
        this.keyFrames(),
        this.options(TIMES.DEFAULT_TRANSITION_TIME)
      )*/
    }
  }

  private prevSlideState(slideIndex: number): Partial<StateType> {
    return { prevSlideIndex: slideIndex }
  }

  private eventTargetState(): Partial<StateType> {
    return { currentEventType: EVENTS.TOUCHEND }
  }
}
