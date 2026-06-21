import { BaseSlider } from "./BaseSlider"
import { EVENTS, isPrimaryInputButton } from "./helpers"
import { listener, removeListener } from "./helpers"
import type { StateType } from "./types"
import type {
  DragabbleListenersParams,
  MouseEventOrTouchEvent
} from "./types"

export class Draggable extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  public init(): void {
    this.setDragListeners(this.params())
  }

  private params(): DragabbleListenersParams {
    const { dragStart } = this

    return {
      element: this.getRootSelector!,
      dragStart: dragStart.bind(this) as EventListener
    }
  }

  private setDragListeners(params: DragabbleListenersParams): void {
    const { dragStart } = params
    const $root = this.getRootSelector!

    listener([EVENTS.MOUSEDOWN, EVENTS.TOUCHSTART], $root, dragStart)
  }

  private dragStart(event: MouseEventOrTouchEvent): void {
    if (!isPrimaryInputButton(event)) return

    const startX = this.defineEventTarget(event).clientX
    const startY = this.defineEventTarget(event).clientY
    const handleMoveEvents = [EVENTS.MOUSEMOVE, EVENTS.TOUCHMOVE]
    const handleEndEvents = [EVENTS.MOUSEUP, EVENTS.TOUCHEND]

    this.setState(this.axisState(startX, startY))
    listener(handleMoveEvents, document, this.handleMove as EventListener)
    listener(handleEndEvents, document, this.handleEnd)
    event.preventDefault()
  }

  private handleMove = (event: MouseEventOrTouchEvent): void => {
    const { isDragging, startX } = this.store
    const moveX = this.defineEventTarget(event).clientX

    if (!isDragging) {
      if (Math.abs(moveX - startX) > 0) {
        this.setState(this.draggingState(true))
      }
    }
  }

  private handleEnd = (): void => {
    const handleMoveEvents = [EVENTS.MOUSEMOVE, EVENTS.TOUCHMOVE]
    const handleEndEvents = [EVENTS.MOUSEUP, EVENTS.TOUCHEND]

    removeListener(handleMoveEvents, document, this.handleMove as EventListener)
    removeListener(handleEndEvents, document, this.handleEnd)
    this.setState(this.draggingState(false))
  }

  private axisState(startX: number, startY: number): Partial<StateType> {
    return {
      startX,
      startY
    }
  }

  private draggingState(condition: boolean): Partial<StateType> {
    return {
      isDragging: condition
    }
  }
}
