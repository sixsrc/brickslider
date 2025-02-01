import { BaseSlider } from "./BaseSlider"
import { Mount } from "./Mount"
import { TypeOptions } from "./State"
import { isValidSelector } from "./helpers"

export class BrickSlider extends BaseSlider {
  public userOptions?: TypeOptions
  public clonedSlides: HTMLElement[] = []
  private mount: Mount | null = null
  private el1: any

  constructor($root: string, options?: TypeOptions) {
    super($root)
    this.el1 = document.querySelector(`${$root} .slider__track`)

    if (isValidSelector($root) && this.el1) {
      this.userOptions = options
      this.mount = new Mount(this.$root)
      options && this.state.setOptions(this.userOptions!)
    } else {
      console.error(`Main selector ${$root} not found.`)
    }
  }

  private validation() {}

  public init(): void {
    if (isValidSelector(this.$root) && this.el1) {
      this.mount?.init()
    }
  }

  public next() {}

  public prev() {}

  public goTo(index: number) {}

  public play() {}

  public pause() {}

  public stop() {}

  public destroy() {}
}
