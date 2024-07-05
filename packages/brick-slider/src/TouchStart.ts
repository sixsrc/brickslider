import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { adjustIndex, eventX, getAxisX } from "./helpers"

export class TouchStart extends BaseSlider {
  private animation: AnimationFrame
  protected eventX: null | TouchEvent | MouseEvent

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
    this.eventX = null
  }

  public init(): (event: TouchEvent | MouseEvent) => void {
    return (event: TouchEvent | MouseEvent) => {
      this.handleTouchStart(event)
      this.mainState(event)
    }
  }

  private handleTouchStart(event: TouchEvent | MouseEvent) {
    console.log(
      "currentTranslate",
      this.store.currentTranslate,
      this.store.slideIndex
    )

    this.eventX = eventX(event as MouseEvent | TouchEvent)
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  protected mainState(event: TouchEvent | MouseEvent) {
    const { slideIndex, slidesPerPage } = this.store
    const isTrue = slidesPerPage <= 1
    const index = isTrue ? adjustIndex(slideIndex, slidesPerPage) : slideIndex

    this.setState({
      startTime: new Date().getMilliseconds(),
      slideIndex: index,
      startPos: getAxisX(event),
      isDragging: true,
      isMouseLeave: false,
      animationID: requestAnimationFrame(this.animation.init)
    })
  }
}
