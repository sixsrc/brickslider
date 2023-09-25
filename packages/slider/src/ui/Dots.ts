import { ATTRIBUTES, dotsSelector, EVENTS, TAGS } from "../util/constants"
import { createDots } from "./functions/createDots"
import { getAllElements } from "../dom/methods/getAllElements"
import { createNewElement } from "../dom/methods/createNewElement"
import { appendToParent } from "../dom/methods/appendToParent"
import { listener } from "../util"
import { updateSliderFromDots } from "./functions/updateSliderFromDots"
import { setAttribute } from "../dom/methods/setAttribute"
import { State, State_Keys } from "../state/BrickState"
import { getRootSelector } from "../core/functions/getRootSelector"

export class Dots {
  $root: string

  constructor($root: string) {
    this.$root = $root
  }

  public init(): void {
    const $root = getRootSelector(this.$root)
    const containerDots = createNewElement(TAGS.UL)
    const state = new State(this.$root)

    setAttribute(containerDots, ATTRIBUTES.CLASS, dotsSelector.replace(".", ""))

    appendToParent($root, containerDots)

    createDots(this.$root, containerDots)

    const dots = getAllElements<HTMLElement>(TAGS.LI, containerDots)

    Array.from(dots).forEach((dot, index) => {
      const updateSliderCallback = () => {
        state.set(State_Keys.SlideIndex, index)
        updateSliderFromDots(this.$root)
      }

      listener(EVENTS.CLICK, dot, updateSliderCallback)
    })
  }
}
