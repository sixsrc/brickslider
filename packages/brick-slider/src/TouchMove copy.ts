import { BaseSlider } from "./BaseSlider"
import { animateElement, eventX, getAxisX, translate3d } from "./helpers"
import { AnimationOptions, KeyframeAnimation } from "./types"

enum IndexesNames {
  First = 0,
  Second = 1,
  Third = 4,
  Last = 5
}
type IndexData = {
  currentIndex: "First" | "Second" | "Third" | "Last"
  translate: number
}

type IndexMap = Record<"first" | "second" | "last", IndexData>

export class TouchMove extends BaseSlider {
  private currentPosition: number
  protected previousPosition: number
  private skipSlide: boolean
  private currentIndex: number
  private translate: number

  constructor($root: string) {
    super($root)
    this.currentPosition = 0
    this.previousPosition = 0
    this.currentIndex = 0
    this.translate = 0
    this.skipSlide = false
  }

  public init = (event: any): void => {
    const { isDragging } = this.store

    if (isDragging) {
      this.updatePosition(event)
      this.handleSwipe()
      this.setState()
      this.animate()
    }
  }

  protected updatePosition(event: Event) {
    this.previousPosition = this.currentPosition
    this.currentPosition = getAxisX(eventX(event as MouseEvent | TouchEvent))
  }

  protected movingTo(position: "right" | "left"): boolean {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = (this.sliderWidth! * 5) / 100 - this.sliderWidth!

    return position === "right" ? translate <= limit : translate >= limit
  }

  protected setState() {
    this.state.set(
      this.skipSlide ? this.infiniteTouchState() : this.mainState()
    )

    this.skipSlide = false
  }

  protected handleSwipe() {
    const { infinite } = this.store

    infinite && this.infiniteSwipe()
  }

  protected infiniteSwipe() {
    switch (true) {
      case this.SlideIndex().isFirstCloned():
        this.jumpSlideTo("first")
        break

      case this.movingTo("right") && this.SlideIndex().isSecondSlide():
        this.jumpSlideTo("second")
        break

      case this.movingTo("left") && this.SlideIndex().isLastCloned():
        this.jumpSlideTo("last")
        break
    }
  }

  private SlideIndex() {
    const { slideIndex } = this.store
    return {
      isFirstCloned: () => slideIndex === 0,
      isSecondSlide: () => slideIndex === 1,
      isLastCloned: () => slideIndex === 5
    }
  }

  private jumpSlideTo(to: keyof IndexMap) {
    this.skipSlide = true
    this.currentIndex = IndexesNames[this.mapIndex()[to].currentIndex]
    this.translate = this.mapIndex()[to].translate
    this.state.set({ isJumpSlide: true })

    console.log({
      currentIndex: this.currentIndex,
      translate: this.translate
    })
  }

  private mapIndex(): IndexMap {
    return {
      first: {
        currentIndex: "Third",
        translate: -2352
      },
      second: {
        currentIndex: "Last",
        translate: -2940
      },
      last: {
        currentIndex: "Second",
        translate: -588
      }
    }
  }

  protected mainState() {
    const { prevTranslate, startPos } = this.store
    const { currentPosition } = this

    return {
      isTouch: true,
      currentTranslate: prevTranslate + currentPosition - startPos!
    }
  }

  protected infiniteTouchState() {
    const { currentIndex, translate } = this

    return {
      slideIndex: currentIndex,
      prevTranslate: translate
    }
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
      duration: 0
    }
  }
}

///private animation: AnimationFrame

////  private eventX: MouseEvent | TouchEvent | null

// this.animation = new AnimationFrame(this.$root)

//   this.eventX = null

/**
 * 
 * 
 * protected movingToRight() {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = (this.sliderWidth! * 5) / 100 - this.sliderWidth!

    //console.log("currentTranslate", currentTranslate)

    return translate <= limit
  }

  protected movingToLeft(): boolean {
    const { currentTranslate } = this.store
    const translate = Math.abs(currentTranslate)
    const limit = (this.sliderWidth! * 5) / 100 - this.sliderWidth!

    return translate >= limit
  }
 */
