import { BaseSlider } from "./BaseSlider"
import { Mount } from "./Mount"
import { Slides } from "./Slides"
import { TypeOptions } from "./State"
import { assert, isValidSelector } from "./helpers"

export class BrickSlider extends BaseSlider {
  private slides: Slides
  private mount: Mount
  public options?: TypeOptions

  constructor($root: string, options?: TypeOptions) {
    super($root)
    assert(isValidSelector($root), "Main Selector Not Found")
    this.options = options
    this.slides = new Slides(this.$root)
    this.mount = new Mount(this.$root)
    options && this.state.setOptions(this.options!)
  }

  public init(): void {
    const { infinite } = this.store

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
