import { State } from "@/state/BrickState"
import { TouchEnd } from "./TouchEnd"
import { TouchMove } from "./TouchMove"
import { TouchStart } from "./TouchStart"
import { EVENTS } from "@/util/constants"
import { getTrackChildren } from "@/dom/getTrackChildren"
import { listener } from "@/util/listener"
import { getSlideNodeList } from "@/dom/getSlideNodeList"

type TouchListenersParams = {
  element: HTMLElement
  index: number
  touchStart: EventListener
  touchEnd: EventListener
  touchMove: EventListener
}

export class Touch {
  public $root: string
  private slider: HTMLElement

  touchStart: TouchStart
  touchEnd: TouchEnd
  touchMove: TouchMove

  constructor($root: string) {
    this.$root = $root
    this.slider = getTrackChildren($root)
    this.slides = getSlideNodeList(this.$root)
    this.state = new State(this.$root)
    this.touchStart = new TouchStart(this.$root)
    this.touchEnd = new TouchEnd(this.$root)
    this.touchMove = new TouchMove(this.$root)
  }

  public init(): void {
    const { touchStart, touchEnd, touchMove } = this

    const params: TouchListenersParams = {
      element: this.slider,
      index: 0,
      touchStart: touchStart.init(),
      touchEnd: touchEnd.init.bind(touchEnd),
      touchMove: touchMove.init.bind(touchMove)
    }

    this.setTouchListeners(params)
  }

  private setTouchListeners(params: TouchListenersParams): void {
    const { element, touchStart, touchEnd, touchMove } = params

    listener([EVENTS.TOUCHSTART, EVENTS.MOUSEDOWN], element, touchStart)
    listener(
      [EVENTS.TOUCHEND, EVENTS.MOUSELEAVE, EVENTS.MOUSEUP],
      element,
      touchEnd
    )
    listener([EVENTS.TOUCHMOVE, EVENTS.MOUSEMOVE], element, touchMove)
  }
}

/*  slides.forEach((slide, index) => {
      const params: TouchListenersParams = {
        element: slide,
        index,
        touchStart: touchStart.init(0),
        touchEnd: touchEnd.init.bind(touchEnd),
        touchMove: touchMove.init.bind(touchMove)
      }
      initTouchListeners(params)
    })

    */
