import { EVENTS } from "../util/constants"
import { createArrowButtons } from "./functions/createArrowButtons"
import { appendArrowButtons } from "./functions/appendArrowButtons"
import { handleClick } from "./functions/handleClick"
import { State, State_Keys } from "@/state/BrickState"
import { listener } from "@/util"

export class Arrows {
  $root: string

  constructor($root: string) {
    this.$root = $root
  }

  public init(): void {
    const { $root } = this

    const state = new State($root)

    const createButtons = createArrowButtons(2)

    const buttons = appendArrowButtons(createButtons, $root)

    buttons.forEach(button => {
      listener(EVENTS.CLICK, button, () => {
        state.set(State_Keys.StartTime, Date.now())

        const setCurrentSlide = handleClick(button, $root)

        setCurrentSlide()
      })
    })
  }
}
