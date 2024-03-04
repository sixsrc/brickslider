import { transform as transformSlider } from "@/transition/transform"
import { setActiveClass } from "./setActiveClass"
import { cloneSlides } from "@/action/cloneSlides"
import { calcTranslate, slideNodeList } from "@/util"
import { State } from "@/state/BrickState"
import { getChildren } from "@/dom/getChildren"

export function setActiveSlide($root: string) {
  const state = new State($root),
    $children = getChildren($root)

  const { currentTranslate, slidesPerPage, slideIndex, slideSpacing } =
    state.store

  const newSlideIndex = currentTranslate + 1,
    translate = calcTranslate($children, slideSpacing, newSlideIndex)

  cloneSlides($root, slidesPerPage)

  setActiveClass(slideNodeList($root), slideIndex, slidesPerPage)

  transformSlider($root, translate)

  state.setMultipleState({
    currentTranslate: translate,
    prevTranslate: translate,
    slideIndex: newSlideIndex
  })
}
