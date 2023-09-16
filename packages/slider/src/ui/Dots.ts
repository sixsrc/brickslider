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
  rootSelector: string

  constructor(rootSelector: string) {
    this.rootSelector = rootSelector
  }

  public init(): void {
    const rootSelector = getRootSelector(this.rootSelector),
      containerDots = createNewElement(TAGS.UL),
      state = new State(this.rootSelector),
      numberOfSlides = state.get(State_Keys.NumberOfSlides)

    setAttribute(containerDots, ATTRIBUTES.CLASS, dotsSelector.replace(".", ""))
    appendToParent(rootSelector, containerDots)

    if (numberOfSlides)
      createDots(this.rootSelector, /*numberOfSlides,*/ containerDots)

    const dots = getAllElements<HTMLElement>(TAGS.LI, containerDots)

    Array.from(dots).forEach((dot, index) => {
      const updateSliderCallback = () => {
        state.set(State_Keys.SlideIndex, index)
        updateSliderFromDots(this.rootSelector)
      }

      listener(EVENTS.CLICK, dot, updateSliderCallback)
    })
  }
}
