import { childrenSelector } from "@/util/constants"
import { State } from "../../state/BrickState"
import { TouchEnd } from "./TouchEnd"
import { TouchMove } from "./TouchMove"
import { TouchStart } from "./TouchStart"
import {
  TouchListenersParams,
  initTouchListeners
} from "@/action/initTouchListeners"
import { getAllElements, getChildren } from "@/dom"
import { getTrackChildren } from "@/dom/getTrackChildren"

export class Touch {
  $root: string
  slider: HTMLElement
  slides: HTMLElement[]
  state: State
  touchStart: TouchStart
  touchEnd: TouchEnd
  touchMove: TouchMove

  constructor($root: string) {
    this.$root = $root
    // this.slider = getChildren($root)
    this.slider = getTrackChildren($root)

    this.slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, this.slider)
    )
    this.state = new State(this.$root)
    this.touchStart = new TouchStart(this.$root)
    this.touchEnd = new TouchEnd(this.$root)
    this.touchMove = new TouchMove(this.$root)
  }

  public init() {
    const { slides, touchStart, touchEnd, touchMove } = this

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
    const params: TouchListenersParams = {
      element: this.slider,
      index: 0,
      touchStart: touchStart.init(0),
      touchEnd: touchEnd.init.bind(touchEnd),
      touchMove: touchMove.init.bind(touchMove)
    }

    initTouchListeners(params)
  }
}
