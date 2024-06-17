import { BaseSlider } from "./BaseSlider"
import { Mount } from "./Mount"
import { Observer } from "./Observer"
import { Slides } from "./Slides"
import { TypeOptions } from "./State"

import { assert, isValidSelector, waitFor } from "./helpers"

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
  }

  public next() {}

  public prev() {}

  public goTo(index: number) {}

  public play() {}

  public pause() {}

  public stop() {}

  public destroy() {}
}
