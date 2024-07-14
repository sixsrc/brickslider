import { AnimationFrame } from "./AnimationFrame"
import { BaseSlider } from "./BaseSlider"
import { Draggable } from "./Draggable"
import { adjustIndex, getAxisX, listener } from "./helpers"
import { StateType } from "./State"
import { MouseEventOrTouchEvent } from "./types"

export class TouchStart extends BaseSlider {
  private animation: AnimationFrame
  private clientX: number

  constructor($root: string) {
    super($root)
    this.animation = new AnimationFrame($root)
    this.clientX = 0
    this.handleEvents()
  }

  public init(event: MouseEventOrTouchEvent): void {
    //const target = this.defineTarget(event)
    //console.log("touchStart", target.clientX())
    this.setState(this.eventTargetState())
    this.setState(this.mainState(event))
  }

  private handleEvents() {
    //const initHandler = this.init.bind(this)

    ///listener(["dragabble"], this.getRootSelector as EventTarget, initHandler)

    new Draggable(this.$root).init()
  }

  protected shouldPreventNextAction() {
    const { currentEventType } = this.store
    return currentEventType === "notMapped"
  }

  private eventTargetState(): Partial<StateType> {
    return {
      currentEventType: "touchStart"
    }
  }

  private startXState(clientX: number, rect: DOMRect) {
    return {
      startX: clientX - rect.left
    }
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
