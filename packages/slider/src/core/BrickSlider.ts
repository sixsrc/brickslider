import { getChildrenCount } from "../dom/methods/getChildrenCount"
import { getFirstChildren } from "../dom/methods/getFirstChildren"
import { CLASS_VALUES, EVENTS } from "../util/constants"
import { addClass } from "../dom/methods/addClass"
import { getSliderWidth } from "../dom/methods/getSliderWidth"
import { listener } from "../util"
import { resize } from "../event/resize"
import { setAcessibilitySlider } from "../action/setAcessibilitySlider"
import { appendSlider } from "./functions/appendSlider"
import { assert } from "../error/assert"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "./functions/getChildren"
import { isValidSelector } from "./functions/isValidSelector"
import { Options } from "../option/Options"
import { initSliderControls } from "./functions/initSliderControls"
import { Methods } from "./Methods"
import { cloneSlides } from "./functions/cloneSlides"
import { matchStateOptions } from "@/util/matchStateOptions"
//import { transform } from "@/transition/transform"

export class BrickSlider extends Methods {
  private clonedSlides: HTMLElement[] = []
  public rootSelector: string
  public options?: Options

  constructor(rootSelector: string, options?: Options) {
    super()
    assert(isValidSelector(rootSelector), "Main Selector Not Found")
    this.rootSelector = rootSelector
    this.options = { ...new Options(), ...options }
  }

  init(): void {
    const { rootSelector, options, clonedSlides } = this

    const childrenSelector = getChildren(rootSelector)

    const state = new State(rootSelector, options)

    matchStateOptions(rootSelector, { [State_Keys.Infinite]: true }, () => {
      cloneSlides(childrenSelector)
    })

    const getCountChildren = getChildrenCount(childrenSelector)

    state.set(State_Keys.NumberOfSlides, getCountChildren)

    const firstSlide = getFirstChildren(getChildren(rootSelector))

    if (firstSlide) addClass([firstSlide], CLASS_VALUES.ACTIVE)

    const childrenSelectorWidth = getSliderWidth(childrenSelector)

    state.set(State_Keys.SliderWidth, childrenSelectorWidth)

    const handleResize = () => resize(rootSelector)

    listener(EVENTS.RESIZE, window, handleResize)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides)

    setAcessibilitySlider(numberOfSlides, childrenSelector, clonedSlides)

    appendSlider(childrenSelector, clonedSlides)

    state.set(State_Keys.LoadPage, false)

    initSliderControls(rootSelector, options)
  }
}
