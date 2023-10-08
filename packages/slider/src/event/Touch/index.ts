import { childrenSelector } from "@/util/constants"
import { getAllElements } from "../../dom/methods/getAllElements"
import { State } from "../../state/BrickState"
import { initTouchListeners, TouchListenersParams } from "./functions/initTouchListeners"
import { TouchEnd } from "./TouchEnd"
import { TouchMove } from "./TouchMove"
import { TouchStart } from "./TouchStart"
import { getChildren } from "@/core/functions/getChildren"

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
    this.slider = getChildren($root)
    this.slides = Array.from(getAllElements<HTMLElement>(`${childrenSelector} > *`, this.slider))
    this.state = new State(this.$root)
    this.touchStart = new TouchStart(this.$root)
    this.touchEnd = new TouchEnd(this.$root)
    this.touchMove = new TouchMove(this.$root)
  }

  public init() {
    const { slides, touchStart, touchEnd, touchMove } = this

    slides.forEach((slide, index) => {
      const params: TouchListenersParams = {
        element: slide,
        index,
        touchStart: touchStart.init(index),
        // touchEnd: (event: Event) => touchEnd.init(event),
        touchEnd: touchEnd.init.bind(touchEnd),
        //touchEnd: touchEnd.init(index),
        touchMove: touchMove.init.bind(touchMove)
      }
      initTouchListeners(params)
    })
  }
}
