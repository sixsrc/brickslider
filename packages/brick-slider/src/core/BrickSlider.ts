import { listener, slideNodeList, isLoop, isValidSelector } from "../util"
import { Resize } from "@/event/Resize"
import {
  appendSlider,
  initSliderControls,
  setActiveClass,
  setActiveSlide
} from "@/action"
import { Options } from "@/option/Options"
import { Methods } from "./Methods"
import { assert } from "@/error/assert"
import { State } from "@/state/BrickState"
import { getChildren, getChildrenCount, getSliderWidth } from "@/dom"
import { EVENTS } from "@/util/constants"

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

    const state = new State($root, options),
      $children = getChildren($root)

    const { slideIndex, slidesPerPage } = state.store

    isLoop(state, () => setActiveSlide($root))

    state.setMultipleState({
      sliderWidth: getSliderWidth($children),
      numberOfSlides: getChildrenCount($children)
    })

    setActiveClass(slideNodeList($root), slideIndex, slidesPerPage)

    listener(EVENTS.RESIZE, window, () => resize.init())

    appendSlider($children, clonedSlides)

    initSliderControls($root, options)
  }
}
