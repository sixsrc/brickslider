import { State, State_Keys } from "../../state/BrickState"
import { matchStateOptions } from "../../util/matchStateOptions"
import { setCurrentSlide, updateDots } from "@/action"
import { FROM } from "@/action/setCurrentSlide"
import { slideIndexBypass } from "@/util"
import { getRootSelector, getSliderWidth } from "@/dom"

export class SetPosition {
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

    const {
      slideIndex: currentIndex,
      numberOfSlides,
      slidesPerPage,
      infinite: isInfinite
    } = state.store

    const sliderWidth = getSliderWidth(slider)

    const currentTranslate = currentIndex * -sliderWidth

    state.setMultipleState({
      [State_Keys.currentTranslate]: currentTranslate,
      [State_Keys.prevTranslate]: currentTranslate
    })

    const [index, from] = [currentIndex, FROM.TOUCH]

    setCurrentSlide({
      from,
      index,
      $root
    })

    const slideIndex = isInfinite
      ? slideIndexBypass(index, numberOfSlides, slidesPerPage)
      : index

    matchStateOptions($root, { [State_Keys.Dots]: true }, () => {
      updateDots(slideIndex, $root)

      console.log("pinduco")
    })
  }
}
