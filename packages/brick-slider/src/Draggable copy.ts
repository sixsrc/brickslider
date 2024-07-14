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
    const { dragStart, dragLeave, dragEnd, dragOver } = this

    listener([EVENTS.DRAGSTART], this.getRootSelector!, dragStart.bind(this))
    //listener(["dragleave"], this.$children, dragLeave.bind(this))
    //listener([EVENTS.DRAGOVER], this.$children, dragOver.bind(this))
    //listener([EVENTS.DRAGEND], this.$children, dragEnd.bind(this))
  }

  private dragStart(event: Event): void {
    console.log("dragstart", event)
    this.state.set({
      isDragging: true
    })
    requestAnimationFrame(this.animation.init)
    event.preventDefault()
  }

  private dragLeave(event: Event): void {
    console.log("dragleave", event)
  }

  private dragEnd(event: Event): void {
    event.stopPropagation()
    console.log("dragend", event)
  }

  private dragOver(event: Event): void {
    console.log("dragover", event)
  }
}
