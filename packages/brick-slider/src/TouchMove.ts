import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import {
  addClass,
  eventX,
  getAxisX,
  getRelativeX,
  getSliderWidth,
  removeClass,
  transform,
  translate3d
} from "./helpers"

export class TouchMove extends BaseSlider {
  private currentPosition: number
  private previousPosition: number
  private animation: AnimationFrame
  private skipSlide: boolean
  private currentIndex: number
  private translate: number
  private eventX: MouseEvent | TouchEvent | null
  sliderWidth: any

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame(this.$root)
    this.currentPosition = 0
    this.previousPosition = 0
    this.currentIndex = 0
    this.translate = 0
    this.skipSlide = false
    this.eventX = null
    this.sliderWidth = getSliderWidth(this.$children)
  }

  public init = (event: any): void => {
    const { isDragging } = this.store

    if (isDragging) {
      this.updatePosition(event)
      this.setState(event)
      this.updateDOM()
    }
  }

  protected updatePosition(event: Event) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))
  }

  protected isMovingRight() {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = (this.sliderWidth * 5) / 100 - this.sliderWidth

    return translate <= limit
  }

  protected isMovingLeft(): boolean {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = (this.sliderWidth * 5) / 100 - this.sliderWidth

    return translate >= limit
  }

  protected setState(event: MouseEvent | TouchEvent) {
    const { slideIndex, infinite, isJumpSlide, velocity } = this.store
    this.eventX = eventX(event as MouseEvent | TouchEvent)

    console.log(this.$children.getBoundingClientRect())

    if (infinite) {
      if (slideIndex === 0) {
        this.skipSlide = true
        this.currentIndex = IndexesNames.Third
        this.translate = -2352
        this.state.set({ isJumpSlide: true })
      }
      if (this.isMovingRight() && slideIndex === 1) {
        this.skipSlide = true
        this.currentIndex = IndexesNames.Last
        this.translate = -2940
        this.state.set({ isJumpSlide: true })
      } else if (this.isMovingLeft() && slideIndex === 5) {
        this.skipSlide = true
        this.currentIndex = IndexesNames.Second
        this.translate = -588
        this.state.set({ isJumpSlide: true })
      }
    }

    this.state.set(
      this.skipSlide ? this.infiniteTouchState() : this.mainState()
    )

    this.skipSlide = false
  }

  protected mainState() {
    const { prevTranslate, startPos } = this.store

    return {
      isTouch: true,
      currentTranslate: prevTranslate + this.currentPosition - startPos
    }
  }

  protected infiniteTouchState() {
    return {
      slideIndex: this.currentIndex,
      prevTranslate: this.translate
    }
  }

  protected updateDOM() {
    const { currentTranslate } = this.store

    this.$children.animate(
      [
        {
          transform: translate3d(currentTranslate, 0, 0)
        }
      ],
      {
        duration: 0
        // easing: "ease",
        //fill: "forwards"
      }
    )
  }
}

enum IndexesNames {
  First = 0,
  Second = 1,
  Third = 4,
  Last = 5
}
