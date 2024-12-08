import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./constants"
import { Draggable } from "./Draggable"
import { adjustIndex, getAxisX, getSliderNodeList } from "./helpers"
import { StateType } from "./State"
import { CurrentEventType, MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private draggable: Draggable

  constructor($root: string) {
    super($root)
    this.draggable = new Draggable($root)
  }

  public init(event: MouseEventOrTouchEvent): void {
    const slides = getSliderNodeList(this.$root, false)
    const lastSlide = slides[2]
    const { infinite, slideIndex, numberOfSlides, slidesPerPage } = this.store
    const isTargetSlide = slideIndex === 0
    console.log(this.store.currentTranslate)
    this.setState({ currentEventType: event.type as CurrentEventType })

    if (infinite && slidesPerPage <= 1) {
      /*  if (isTargetSlide) {
        this.animate(lastSlide, this.keyFrames(), this.options())

        this.state.set({
          currentTranslate: this.calcTranslate(numberOfSlides),
          prevTranslate: this.calcTranslate(numberOfSlides),
          slideIndex: numberOfSlides
        })

        this.animate(this.$children, this.keyFrames(), this.options())
       }*/
    }

    this.handleEvents()

    this.setState(this.mainState(event))
  }

  private handleEvents(): void {
    this.draggable.init()
  }

  protected mainState(event: TouchEvent | MouseEvent): Partial<StateType> {
    const { slideIndex, slidesPerPage } = this.store
    const isTrue = slidesPerPage <= 1
    const index = isTrue ? adjustIndex(slideIndex, slidesPerPage) : slideIndex

    return {
      currentEventType: EVENTS.TOUCHSTART,
      startTime: new Date().getMilliseconds(),
      slideIndex: index,
      startPos: getAxisX(event),
      isMouseLeave: false
    }
  }
}
