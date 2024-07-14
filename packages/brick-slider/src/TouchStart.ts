import { BaseSlider } from "./BaseSlider"
import { ContextMenu } from "./ContextMenu"
import { Draggable } from "./Draggable"
import { adjustIndex, getAxisX } from "./helpers"
import { MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private _draggable: Draggable
  private _contextMenu: ContextMenu

  constructor($root: string) {
    super($root)
    this._draggable = new Draggable($root)
    this._contextMenu = new ContextMenu($root)
  }

  public init(event: MouseEventOrTouchEvent): void {
    this.setState(this.mainState(event))
    this.handleEvents()
  }

  private handleEvents() {
    this._draggable.init()
    this._contextMenu.init()
  }

  protected mainState(event: TouchEvent | MouseEvent) {
    const { slideIndex, slidesPerPage } = this.store
    const isTrue = slidesPerPage <= 1
    const index = isTrue ? adjustIndex(slideIndex, slidesPerPage) : slideIndex

    return {
      startTime: new Date().getMilliseconds(),
      slideIndex: index,
      startPos: getAxisX(event),
      isMouseLeave: false
    }
  }
}
