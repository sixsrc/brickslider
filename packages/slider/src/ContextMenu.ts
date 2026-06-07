import { BaseSlider } from "./BaseSlider"
import { EVENTS, FROM } from "./helpers"
import { listener } from "./helpers"
import type { ContextMenuListenersParams } from "./types"

export class ContextMenu extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  init(): void {
    this.setContextListener(this.params())
  }

  private rightClick(_event: Event): void {
    const eventTypeState = this.contextMenuState()

    this.setState(eventTypeState)
  }

  private contextMenuState(): {
    currentEventType: typeof FROM.RIGHT_CLICK
    isDragging: boolean
    isTouch: boolean
    isMouseLeave: boolean
  } {
    return {
      currentEventType: FROM.RIGHT_CLICK,
      isDragging: false,
      isTouch: false,
      isMouseLeave: true
    }
  }

  private params(): ContextMenuListenersParams {
    const { rightClick } = this

    return {
      element: this.getRootSelector!,
      rightClick: rightClick.bind(this) as EventListener
    }
  }

  private setContextListener(params: ContextMenuListenersParams): void {
    const { rightClick } = params
    const $root = this.getRootSelector!

    listener([EVENTS.CONTEXTMENU], $root, rightClick)
  }
}
