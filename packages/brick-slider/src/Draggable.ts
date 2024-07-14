import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { ATTRIBUTES, EVENTS } from "./constants"
import { listener } from "./helpers"

export class Draggable extends BaseSlider {
  animation: AnimationFrame

  constructor($root: string) {
    super($root)
    this.getRootSelector!.setAttribute(ATTRIBUTES.DRAGGABLE, "true")
    this.animation = new AnimationFrame($root)
  }

  public init(): void {
    this.setDragListeners()
  }

  private setDragListeners(): void {
    const { dragStart } = this
    const $root = this.getRootSelector!
    listener([EVENTS.MOUSEDOWN, EVENTS.TOUCHSTART], $root, dragStart.bind(this))
  }

  private dragStart(event: MouseEvent | TouchEvent): void {
    const startX =
      event instanceof MouseEvent ? event.clientX : event.touches[0].clientX
    const startY =
      event instanceof MouseEvent ? event.clientY : event.touches[0].clientY
    // let isDragging = false
    //
    const { isDragging } = this.store

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const moveX =
        moveEvent instanceof MouseEvent
          ? moveEvent.clientX
          : moveEvent.touches[0].clientX
      const moveY =
        moveEvent instanceof MouseEvent
          ? moveEvent.clientY
          : moveEvent.touches[0].clientY

      if (!isDragging) {
        if (Math.abs(moveX - startX) > 5 || Math.abs(moveY - startY) > 5) {
          //  isDragging = true
          this.state.set({ isDragging: true })
          requestAnimationFrame(this.animation.init)
        } else {
          return
        }
      }

      /*const customDragEvent = new CustomEvent("draggable", {
        detail: { startX, startY, moveX, moveY, originalEvent: moveEvent },
        bubbles: true,
        cancelable: true
        })*/

      //this.getRootSelector!.dispatchEvent(customDragEvent)
    }

    const handleEnd = () => {
      document.removeEventListener("mousemove", handleMove)
      document.removeEventListener("touchmove", handleMove)
      document.removeEventListener("mouseup", handleEnd)
      document.removeEventListener("touchend", handleEnd)
      this.state.set({ isDragging: false })
    }

    document.addEventListener("mousemove", handleMove)
    document.addEventListener("touchmove", handleMove)
    document.addEventListener("mouseup", handleEnd)
    document.addEventListener("touchend", handleEnd)

    event.preventDefault()
  }
}
