import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { StateType } from "./State"
import { adjustIndex, eventX, getAxisX, translate3d } from "./helpers"

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
    this.eventX = eventX(event as MouseEvent | TouchEvent)
  }

  protected setState(state: Partial<StateType>) {
    this.state.set(state)
  }

  protected mainState(event: TouchEvent | MouseEvent) {
    const { slideIndex, slidesPerPage } = this.store

    this.setState({
      startTime: new Date().getMilliseconds(),
      slideIndex: adjustIndex(slideIndex, slidesPerPage),
      startPos: getAxisX(event),
      isDragging: true,
      isMouseLeave: false,
      animationID: requestAnimationFrame(this.animation.init)
    })
  }
}
