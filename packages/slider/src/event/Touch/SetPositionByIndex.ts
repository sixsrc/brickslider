import { slideIndexBypass } from "@/core/functions/slideIndexBypass"
import { FROM, setCurrentSlide } from "../../action/setCurrentSlide"
import { updateDots } from "../../action/updateDots"
import { getRootSelector } from "../../core/functions/getRootSelector"
import { getSliderWidth } from "../../dom/methods/getSliderWidth"
import { State, State_Keys } from "../../state/BrickState"
import { matchStateOptions } from "../../util/matchStateOptions"
import { getChildren } from "@/core/functions/getChildren"
import { getChildrenCount } from "@/dom/methods/getChildrenCount"

export class SetPositionByIndex {
  state: State
  $root: string
  slider: HTMLElement

  constructor($root: string) {
    this.state = new State($root)
    this.$root = $root
    this.slider = getRootSelector($root)
  }

  init(): void {
    const { state, $root, slider } = this

    const currentIndex = state.get(State_Keys.SlideIndex)

    const sliderWidth = getSliderWidth(slider)

    const currentTranslate = currentIndex * -sliderWidth

    state.setMultipleState({
      [State_Keys.currentTranslate]: currentTranslate,
      [State_Keys.prevTranslate]: currentTranslate
    })

    //console.log(currentTranslate)

    const [index, from] = [currentIndex, FROM.TOUCH]

    setCurrentSlide({
      from,
      index: state.get(State_Keys.SlideIndex),
      rootSelector: $root
    })

    const isInfinite = state.get(State_Keys.Infinite)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const $children = getChildren($root)

    const numberOfSlides = getChildrenCount($children)

    const slideIndex = isInfinite
      ? slideIndexBypass(index, numberOfSlides, slidesPerPage)
      : index

    const setActiveDot = () => {
      updateDots(slideIndex, $root)
    }

    matchStateOptions($root, { [State_Keys.Dots]: true }, setActiveDot)
  }
}
