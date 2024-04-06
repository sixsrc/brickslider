import { BaseSlider } from "./BaseSlider"
import { Mount } from "./Mount"
import { Observer } from "./Observer"
import { Slides } from "./Slides"
import { TypeOptions } from "./State"
import { EVENTS } from "./constants"

import {
  assert,
  isValidSelector,
  listener,
  removeClass,
  transform
} from "./helpers"

export class BrickSlider extends BaseSlider {
  private slides: Slides
  private mount: Mount
  public options?: TypeOptions
  private observer: Observer

  constructor($root: string, options?: TypeOptions) {
    super($root)
    assert(isValidSelector($root), "Main Selector Not Found")
    this.options = options
    this.slides = new Slides(this.$root)
    this.mount = new Mount(this.$root)
    options && this.state.setOptions(this.options!)
    this.observer = new Observer(this.$children)
  }

  public init(): void {
    const { infinite, slideIndex } = this.store

    if (infinite) this.slides.cloneSlides()

    this.mount.init()
    this.observer.init("getTranslateValue", () => {
      let { currentTranslate } = this.store

      listener([EVENTS.TRANSITIONEND], this.$children, () => {
        if (Math.abs(this.store.currentTranslate) === 588) {
          removeClass(this.$children, "transition")
          this.state.set({
            currentTranslate: -2940,
            prevTranslate: -2940,
            slideIndex: 5
          })
          transform(this.$root)
        }
      })
    })
  }

  public next() {}

  public prev() {}

  public goTo(index: number) {}

  public play() {}

  public pause() {}

  public stop() {}

  public destroy() {}
}
