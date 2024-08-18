import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./constants"
import { ContextMenu } from "./ContextMenu"
import { Draggable } from "./Draggable"
import { adjustIndex, getAxisX } from "./helpers"
import { StateType } from "./State"
import { MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private draggable: Draggable
  private contextMenu: ContextMenu

  constructor($root: string) {
    super($root)
    this.draggable = new Draggable($root)
    this.contextMenu = new ContextMenu($root)
  }

  public init(event: MouseEventOrTouchEvent): void {
    this.setState(this.mainState(event))
    this.handleEvents()
  }

  private handleEvents(): void {
    this.draggable.init()
    this.contextMenu.init()
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
