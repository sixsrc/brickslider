import { assert } from "@/error/assert"
import { TypeOptions } from "@/state/BrickState"
import { isValidSelector } from "@/util/isValidSelector"
import { Slides } from "./Slides"
import { Base } from "./Base"
import { Mount } from "./Mount"

export class BrickSlider extends Base {
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
