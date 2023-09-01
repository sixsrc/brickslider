import { getChildrenCount } from '../dom/methods/getChildrenCount'
import { getFirstChildren } from '../dom/methods/getFirstChildren'
import { CLASS_VALUES, EVENTS } from '../util/constants'
import { addClass } from '../dom/methods/addClass'
import { getSliderWidth } from '../dom/methods/getSliderWidth'
import { listener } from '../util'
import { resize } from '../event/resize'
import { setAcessibilitySlider } from '../action/setAcessibilitySlider'
import { appendSlider } from './functions/appendSlider'
//import { initSliderControls } from "./functions/initSliderControls";
import { assert } from '../error/assert'
import { State, State_Keys } from '../state/BrickState'
import { getChildren } from './functions/getChildren'
import { isValidSelector } from './functions/isValidSelector'
import { Options } from '../option/Options'
import { initSliderControls } from './functions/initSliderControls'
import { BrickMethods } from './BrickMethods'

export class BrickSlider extends BrickMethods {
  private clonedSlides: HTMLElement[] = []
  public rootSelector: string

  public options?: Options

  constructor(rootSelector: string, options?: Options) {
    super()
    assert(isValidSelector(rootSelector), 'Main Selector Not Found')
    this.rootSelector = rootSelector
    this.options = { ...new Options(), ...options }
  }

  init(): void {
    const { rootSelector, options } = this,
      state = new State(rootSelector, options),
      childrenSelector = getChildren(rootSelector),
      getCountChildren = getChildrenCount(childrenSelector)

    state.set(State_Keys.NumberOfSlides, getCountChildren)

    const firstSlide = getFirstChildren(childrenSelector)

    if (firstSlide) addClass([firstSlide], CLASS_VALUES.ACTIVE)

    const childrenSelectorWidth = getSliderWidth(childrenSelector)

    state.set(State_Keys.SliderWidth, childrenSelectorWidth)

    const handleResize = () => resize(rootSelector)

    listener(EVENTS.RESIZE, window, handleResize)

    const numberOfSlides = state.get(State_Keys.NumberOfSlides),
      clonedSlides = this.clonedSlides

    setAcessibilitySlider(numberOfSlides, childrenSelector, clonedSlides)

    appendSlider(childrenSelector, clonedSlides)

    initSliderControls(rootSelector, options)
  }
}
