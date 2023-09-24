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

export class BrickSlider extends Methods {
  clonedSlides: HTMLElement[] = []
  $root: string
  options?: Options

  constructor($root: string, options?: Options) {
    super()
    assert(isValidSelector($root), "Main Selector Not Found")
    this.$root = $root
    this.options = { ...new Options(), ...options }
  }

  init(): void {
    const { $root, options, clonedSlides } = this

    const childrenSelector = getChildren($root)

    const state = new State($root, options)

    matchStateOptions($root, { [State_Keys.Infinite]: true }, () => {
      cloneSlides(childrenSelector)
    })

    const getCountChildren = getChildrenCount(childrenSelector)

    state.set(State_Keys.NumberOfSlides, getCountChildren)

    const firstSlide = getFirstChildren(getChildren($root)) as Element

    addClass([firstSlide], CLASS_VALUES.ACTIVE)

    const childrenSelectorWidth = getSliderWidth(childrenSelector)

    state.set(State_Keys.SliderWidth, childrenSelectorWidth)

    const handleResize = () => resize($root)

    listener(EVENTS.RESIZE, window, handleResize)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides)

    setAcessibilitySlider(numberOfSlides, childrenSelector, clonedSlides)

    appendSlider(childrenSelector, clonedSlides)

    state.set(State_Keys.LoadPage, false)

    initSliderControls($root, options)
  }
}
