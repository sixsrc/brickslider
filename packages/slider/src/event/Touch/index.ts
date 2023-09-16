import { childrenSelector /*TAGS*/ } from "@/util/constants"
//import { getRootSelector } from "../../core/functions/getRootSelector"
import { getAllElements } from "../../dom/methods/getAllElements"
import { State } from "../../state/BrickState"
import { initTouchListeners } from "./functions/initTouchListeners"
import { TouchEnd } from "./TouchEnd"
import { TouchListenersParams } from "./TouchListenersParams"
import { TouchMove } from "./TouchMove"
import { TouchStart } from "./TouchStart"
import { getChildren } from "@/core/functions/getChildren"

export class Touch {
  public rootSelector: string
  public slider: HTMLElement
  public slides: HTMLElement[]
  state: State
  touchStart: TouchStart
  touchEnd: TouchEnd
  touchMove: TouchMove

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector
    this.slider = getChildren(rootSelector)
    this.slides = Array.from(
      getAllElements<HTMLElement>(`${childrenSelector} > *`, this.slider)
    )
    this.state = new State(this.rootSelector)
    this.touchStart = new TouchStart(this.rootSelector)
    this.touchEnd = new TouchEnd(this.rootSelector)
    this.touchMove = new TouchMove(this.rootSelector)
  }

  public init() {
    const { slides, touchStart, touchEnd, touchMove } = this

    slides.forEach((slide, index) => {
      const params: TouchListenersParams = {
        element: slide,
        index,
        touchStart: touchStart.init(index),
        touchEnd: touchEnd.init.bind(touchEnd),
        touchMove: touchMove.init.bind(touchMove)
      }
      initTouchListeners(params)
    })
  }
}
