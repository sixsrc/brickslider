import { getChildrenCount } from "../dom/methods/getChildrenCount"
import { EVENTS, slideNodeList } from "../util/constants"
import { getSliderWidth } from "../dom/methods/getSliderWidth"
import { calcTranslate, listener } from "../util"
//import { setAcessibilitySlider } from "../action/setAcessibilitySlider"
import { appendSlider } from "./functions/appendSlider"
import { assert } from "../error/assert"
import { State, State_Keys } from "../state/BrickState"
import { getChildren } from "./functions/getChildren"
import { isValidSelector } from "./functions/isValidSelector"
import { Options } from "../option/Options"
import { initSliderControls } from "./functions/initSliderControls"
import { Methods } from "./Methods"
import { cloneSlides } from "./functions/cloneSlides"
import { Resize } from "@/event/Resize"
import { transform as transformSlider } from "@/transition/transform"
import { setActiveClass } from "@/action/setActiveClass"

export class BrickSlider extends Methods {
  clonedSlides: HTMLElement[] = []
  $root: string
  options?: Options
  resize: Resize

  constructor($root: string, options?: Options) {
    super()
    assert(isValidSelector($root), "Main Selector Not Found")
    this.$root = $root
    this.options = { ...new Options(), ...options }
    this.resize = new Resize($root)
  }

  init(): void {
    const { $root, options, clonedSlides, resize } = this

    const $children = getChildren($root)

    const state = new State($root, options)

    const { currentTranslate, slideSpacing, slidesPerPage, infinite } =
      state.store

    const newSlideIndex = currentTranslate + 1

    const sliderWidth = getSliderWidth($children)

    state.set(State_Keys.SliderWidth, sliderWidth)

    if (infinite) {
      cloneSlides($root, slidesPerPage)

      state.set(State_Keys.SlideIndex, newSlideIndex)

      const slideIndex = state.get(State_Keys.SlideIndex)

      setActiveClass(slideNodeList($root), slideIndex, slidesPerPage)

      const translate = calcTranslate($children, slideSpacing, newSlideIndex)

      transformSlider($root, translate)

      state.setMultipleState({
        [State_Keys.currentTranslate]: translate,
        [State_Keys.prevTranslate]: translate
      })
    }

    state.set(State_Keys.NumberOfSlides, getChildrenCount($children))

    const slideIndex = state.get(State_Keys.SlideIndex)

    setActiveClass(slideNodeList($root), slideIndex, slidesPerPage)

    listener(EVENTS.RESIZE, window, () => resize.init())

    // setAcessibilitySlider($root, $children, numberOfSlides, clonedSlides)

    appendSlider($children, clonedSlides)

    initSliderControls($root, options)
  }
}
