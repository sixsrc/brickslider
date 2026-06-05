import { BaseSlider } from "./BaseSlider"
import { EVENTS, FROM } from "./helpers"
import { listener } from "./helpers"
import { ContextMenuListenersParams } from "./types"

export class ContextMenu extends BaseSlider {
  constructor($root: string) {
    super($root)
  }

  init(): void {
    this.setContextListener(this.params())
  }

  private rightClick() {
    this.setState({ currentEventType: FROM.RIGHT_CLICK })
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
