import { BaseSlider } from "./BaseSlider"
import { Mount } from "./Mount"
import { TypeOptions } from "./State"
import {
  assert,
  getFastInteraction,
  isValidSelector,
  listener
} from "./helpers"

export class BrickSlider extends BaseSlider {
  public userOptions?: TypeOptions
  public clonedSlides: HTMLElement[] = []
  private mount: Mount

  constructor($root: string, options?: TypeOptions) {
    super($root)
    assert(isValidSelector($root), "Main Selector Not Found")
    this.userOptions = options

    this.mount = new Mount(this.$root)
    options && this.state.setOptions(this.userOptions!)
  }

  public init(): void {
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
