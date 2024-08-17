import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { EVENTS } from "./constants"
import { listener, removeListener } from "./helpers"
import { StateType } from "./State"
import { DragabbleListenersParams, MouseEventOrTouchEvent } from "./types"

export class Draggable extends BaseSlider {
  animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
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
    const startX = this.defineEventTarget(event).clientX
    const startY = this.defineEventTarget(event).clientY
    const handleMoveEvents = [EVENTS.MOUSEMOVE, EVENTS.TOUCHMOVE]
    const handleEndEvents = [EVENTS.MOUSEUP, EVENTS.TOUCHEND]

    this.setState(this.axisState(startX, startY))

    listener(handleMoveEvents, document, this.handleMove as any)
    listener(handleEndEvents, document, this.handleEnd)

    event.preventDefault()
  }

  private handleMove = (event: MouseEventOrTouchEvent): void => {
    const { isDragging, startX, startY } = this.store
    const moveX = this.defineEventTarget(event).clientX
    const moveY = this.defineEventTarget(event).clientY

    if (!isDragging) {
      if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 2) {
        this.setState(this.draggingState(true))
      }
    }
  }

  private handleEnd = (): void => {
    const handleMoveEvents = [EVENTS.MOUSEMOVE, EVENTS.TOUCHMOVE]
    const handleEndEvents = [EVENTS.MOUSEUP, EVENTS.TOUCHEND]

    removeListener(handleMoveEvents, document, this.handleMove as any)
    removeListener(handleEndEvents, document, this.handleEnd)

    this.setState(this.draggingState(false))
  }

  private axisState(startX: number, startY: number): Partial<StateType> {
    return {
      startX,
      startY
    }
  }

  private draggingState(condition: boolean) {
    return {
      isDragging: condition
    }
  }
}
