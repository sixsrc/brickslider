import { listener, isValidSelector, arrayToClasses } from "../util"
import { Resize } from "@/event/Resize"
import { appendSlider, setAcessibility, setActiveSlide } from "@/action"
import { Options } from "@/option/Options"
import { Methods } from "./Methods"
import { assert } from "@/error/assert"
import { State, StateType } from "@/state/BrickState"
import { EVENTS } from "@/util/constants"
import { Actions } from "./Actions"

export class BrickSlider extends Methods {
  private clonedSlides: HTMLElement[] = []
  public $root: string
  public options?: Options
  private resize: Resize
  private instances: (State | Actions)[]

  constructor($root: string, options?: Options) {
    super()
    assert(isValidSelector($root), "Main Selector Not Found")
    this.$root = $root
    this.options = { ...new Options(), ...options }
    this.resize = new Resize($root)
    this.instances = arrayToClasses([State, Actions], this.$root, options)
  }

  public init(): void {
    const { options, clonedSlides, resize } = this
    const [state, slider] = this.instances as [State, Actions]
    const { slideIndex, slidesPerPage, infinite } = state.store as StateType

    if (infinite) slider.setSlideActiveCloned()

    const [sliderWidth, numberOfSlides] = [
      slider.getSliderWidth(),
      slider.getChildrenCount()
    ]

    state.setMultipleState({
      sliderWidth,
      numberOfSlides
    })

    setActiveSlide(slider.getSlideNodeList(), slideIndex, slidesPerPage)

    listener(EVENTS.RESIZE, window, () => resize.init())

    setAcessibility(
      this.$root,
      slider.getChildren(),
      numberOfSlides,
      clonedSlides
    )

    appendSlider(slider.getChildren(), clonedSlides)

    slider.setSliderControls(options)
  }
}

//const instances = arrayToClasses([State, Actions], this.$root, options)
