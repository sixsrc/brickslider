import { getChildrenCount } from "../dom/methods/getChildrenCount"
import { getFirstChildren } from "../dom/methods/getFirstChildren"
import { CLASS_VALUES, EVENTS, slideNodeList } from "../util/constants"
import { addClass } from "../dom/methods/addClass"
import { getSliderWidth } from "../dom/methods/getSliderWidth"
import { calcTranslate, listener } from "../util"
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
import { Resize } from "@/event/Resize"
import { transform as transformSlider } from "@/transition/transform"

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

    const currentTranslate = state.get(State_Keys.currentTranslate)

    const newSlideIndex = currentTranslate + 1

    const slideMargin = state.get(State_Keys.SlideMargin)

    const translate = calcTranslate($children, slideMargin, newSlideIndex)

    const isInfinite = state.get(State_Keys.Infinite)

    const slide = slideNodeList($root)[currentTranslate]

    if (isInfinite) {
      cloneSlides($children)

      state.set(State_Keys.SlideIndex, newSlideIndex)

      addClass([slide], CLASS_VALUES.ACTIVE)

      transformSlider($root, translate)

      state.setMultipleState({
        [State_Keys.currentTranslate]: translate,
        [State_Keys.prevTranslate]: translate
      })
    }

    const sliderWidth = getSliderWidth($children)

    state.set(State_Keys.SliderWidth, sliderWidth)

    const getCountChildren = getChildrenCount($children)

    state.set(State_Keys.NumberOfSlides, getCountChildren)

    const firstSlide = getFirstChildren(getChildren($root)) as Element

    if (!isInfinite) addClass([firstSlide], CLASS_VALUES.ACTIVE)

    const handleResize = () => resize.init()

    listener(EVENTS.RESIZE, window, handleResize)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides)

    setAcessibilitySlider($root, $children, numberOfSlides, clonedSlides)

    appendSlider($children, clonedSlides)

    initSliderControls($root, options)
  }
}
