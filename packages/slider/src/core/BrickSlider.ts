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

    const currentTranslate = state.get(State_Keys.currentTranslate)

    const newSlideIndex = currentTranslate + 1

    const slideSpacing = state.get(State_Keys.SlideSpacing)

    const translate = calcTranslate($children, slideSpacing, newSlideIndex)

    const isInfinite = state.get(State_Keys.Infinite)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const slide = slideNodeList($root)[currentTranslate]

    if (isInfinite && slidesPerPage <= 1) {
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

    const numberOfSlides = state.get(State_Keys.NumberOfSlides)

    const slideIndex = state.get(State_Keys.SlideIndex)

    if (!isInfinite) setActiveClass(slideNodeList($root), slideIndex, slidesPerPage, numberOfSlides)
    //addClass([firstSlide], CLASS_VALUES.ACTIVE)

    const handleResize = () => resize.init()

    listener(EVENTS.RESIZE, window, handleResize)

    // //setAcessibilitySlider($root, $children, numberOfSlides, clonedSlides)

    appendSlider($children, clonedSlides)

    initSliderControls($root, options)
  }
}
