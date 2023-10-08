import { EVENTS } from "../util/constants"
import { listener } from "../util"
import { createArrowButtons } from "./functions/createArrowButtons"
import { appendArrowButtons } from "./functions/appendArrowButtons"
import { handleClick } from "./functions/handleClick"

export class Arrows {
  $root: string

  constructor($root: string) {
    this.$root = $root
  }

  public init(): void {
    const { $root } = this

    const createButtons = createArrowButtons(2)

    const buttons = appendArrowButtons(createButtons, $root)

    buttons.forEach(button => {
      const setCurrentSlide = handleClick(button, $root)

      listener(EVENTS.CLICK, button, setCurrentSlide)
    })
  }
}
