import { getChildren, getSliderWidth, setStyle } from "@/dom"
import { State } from "@/state/BrickState"
import { slideNodeList, mathAbs, waitFor } from "@/util"
import { setActiveClass } from "./setActiveClass"
import { transform as transformSlider } from "@/transition/transform"
import { STYLES, TIMES } from "@/util/constants"
import { updateDots } from "./updateDots"
import { endSlideJumpingAction } from "./endSlideJumpingAction"

export function shouldJumpingSlide($root: string, state: State) {
  const { slidesPerPage, currentTranslate, infinite: isInfinite } = state.store

  const $children = getChildren($root)
  const sliderWidth = getSliderWidth($children)
  const condition = isInfinite && mathAbs(currentTranslate) <= sliderWidth / 2

  switch (true) {
    case condition:
      state.setMultipleState({
        isJumpSlide: true,
        slideIndex: 3,
        currentTranslate: -(mathAbs(currentTranslate) + 2352)
      })

      const newTranslate = state.store["currentTranslate"]

      setStyle($children, STYLES.TRANSITION, "")

      setActiveClass(slideNodeList($root), 4, slidesPerPage)

      transformSlider($root, -newTranslate)

      updateDots(3, $root)

      waitFor(TIMES.WITHOUT_TIMER, () =>
        endSlideJumpingAction($root, $children, state)
      )
      break
  }
}

//let newTranslate = state.get(State_Keys.currentTranslate)
// const translate = toAbsoluteNumber(setCurrentTranslate)
//const slides = slideNodeList($root)
// const setTranslate = toAbsoluteNumber(setCurrentTranslate) + 2352
//
//       //setCurrentTranslate = newTranslate
