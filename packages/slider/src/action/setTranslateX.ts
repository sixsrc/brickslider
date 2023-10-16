import { getChildren } from "@/core/functions/getChildren"
import { State, State_Keys } from "../state/BrickState"
import { calcTranslate } from "@/util"

export function setTranslateX($root: string, currentTranslateFixedValue: number): number {
  const state = new State($root)

  const $children = getChildren($root)

  const currentSlideIndex = state.get(State_Keys.SlideIndex)

  const slideSpacing = state.get(State_Keys.SlideSpacing)

  // const sliderWidth = state.get(State_Keys.SliderWidth)
  // const marginDiference = currentSlideIndex * slideMargin
  //const sliderWidth = state.get(State_Keys.SliderWidth)
  // const translate = -(sliderWidth * currentSlideIndex + marginDiference)

  // const slidesPerPage = state.get(State_Keys.SlidesPerPage)

  const translate = calcTranslate($children, slideSpacing, currentSlideIndex)

  const translateFixedValue = currentTranslateFixedValue!

  !currentTranslateFixedValue &&
    state.setMultipleState({
      [State_Keys.prevTranslate]: translate,
      [State_Keys.currentTranslate]: translate
    })

  //console.log("translate", translate)

  return translateFixedValue ? translateFixedValue : translate
}
