import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./helpers"
import { Draggable } from "./Draggable"
import { getAxisX } from "./helpers"
import { StateType } from "./State"
import { MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private draggable: Draggable

  constructor($root: string) {
    super($root)
    this.draggable = new Draggable($root)
  }

  public init(event: MouseEventOrTouchEvent): void {
    this.handleEvents()
    this.setState(this.mainState(event))
  }

  private handleEvents(): void {
    this.draggable.init()
  }

  protected mainState(event: TouchEvent | MouseEvent): Partial<StateType> {
    const { slideIndex } = this.store
    const index = slideIndex

    return {
      currentEventType: EVENTS.TOUCHSTART,
      startTime: Date.now(),
      slideIndex: index,
      startPos: getAxisX(event),
      isMouseLeave: false
    }
  }
}
