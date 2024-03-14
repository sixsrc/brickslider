import { State } from "@/state/BrickState"
import { mathAbs, slideNodeList, waitFor } from "@/util"
import { endSkip, updateDots } from "@/action"
import { transform as transformSlider } from "@/transition/transform"
import { STYLES, TIMES, TRANSITIONS } from "@/util/constants"
import { getChildren, setStyle } from "@/dom"
import { updateActiveSlide } from "./updateActiveSlide"

/*export function goToCloned($root: string, state: State): void {
  const { numberOfSlides, currentTranslate, slidesPerPage } = state.store
  const $children = getChildren($root)

  state.setMultipleState({
    isJumpSlide: true,
    slideIndex: numberOfSlides - 1,
    currentTranslate: -(mathAbs(currentTranslate) + 2352)
  })

  //const newTranslate = state.store["currentTranslate"]

  updateActiveSlide(slideNodeList($root), numberOfSlides, slidesPerPage)

  // transformSlider($root, -newTranslate)

  updateDots(numberOfSlides - 1, $root)

  waitFor(TIMES.WITHOUT_TIMER, () => {
    state.setMultipleState({
      currentTranslate: -2352,
      prevTranslate: -2352
    })

    setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)

    transformSlider($root, -2352)
  })
}*/

export function goToCloned($root: string, state: State): void {
  const { numberOfSlides, slidesPerPage, currentTranslate } = state.store

  const $children = getChildren($root)

  const stateUpdates = [
    {
      isJumpSlide: true,
      slideIndex: numberOfSlides - 1,
      currentTranslate: -(mathAbs(currentTranslate) + 2352)
    },
    {
      currentTranslate: -2352,
      prevTranslate: -2352
    }
  ]

  const executeNextUpdate = (index: number) => {
    if (index < stateUpdates.length) {
      const values = stateUpdates[index]

      state.setMultipleState(values)

      updateActiveSlide(slideNodeList($root), numberOfSlides, slidesPerPage)

      updateDots(numberOfSlides - 1, $root)

      if (index === stateUpdates.length - 1) {
        setStyle($children, STYLES.TRANSITION, TRANSITIONS.TRANSFORM_EASE)
        transformSlider($root, -2352)
      } else {
        waitFor(TIMES.WITHOUT_TIMER, () => executeNextUpdate(index + 1))
      }
    }
  }
  executeNextUpdate(0)
}
