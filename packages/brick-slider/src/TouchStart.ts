import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { State_Keys } from "./State"
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
    this.eventX = eventX(event as MouseEvent | TouchEvent)
  }

  protected setState(state: any) {
    this.state.set(state)
  }

  protected mainState(event: TouchEvent | MouseEvent) {
    const { slideIndex, slidesPerPage } = this.store

    this.setState({
      [State_Keys.SliderReady]: false,
      [State_Keys.StartTime]: new Date().getMilliseconds(),
      [State_Keys.SlideIndex]: adjustIndex(slideIndex, slidesPerPage),
      [State_Keys.StartPos]: getAxisX(event),
      [State_Keys.isDragging]: true,
      [State_Keys.IsMouseLeave]: false,
      [State_Keys.AnimationID]: requestAnimationFrame(this.animation.init)
    })
  }
}

//const setEvent = eventX(event as MouseEvent | TouchEvent)
//const { slidesPerPage, slideIndex } = this.store
