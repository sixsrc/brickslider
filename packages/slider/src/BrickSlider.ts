import { BaseSlider } from "./BaseSlider"
import { Messages } from "./Messages"
import { Mount } from "./Mount"
import { StateType, TypeOptions } from "./State"
import { Validation } from "./Validation"
import { isValidSelector } from "./helpers"

export class BrickSlider extends BaseSlider {
  public userOptions?: TypeOptions
  private mount: Mount | null = null
  private validate: Validation
  private message: Messages

  constructor($root: string, options?: TypeOptions) {
    super($root)
    this.validate = new Validation($root)
    this.message = new Messages($root)
    this.validation($root, options)
  }

  private validation($root: string, options?: TypeOptions) {
    const isValid = isValidSelector($root) && this.validate.isValid()

    if (isValid) this.defineConfigs($root, options)
    else this.message.displayMessage()
  }

  private defineConfigs($root: string, options?: TypeOptions) {
    this.userOptions = options
    this.mount = new Mount($root)
    this.setOptions(options)
  }

  private setOptions(options: Partial<StateType> | undefined) {
    options && this.state.setOptions(this.userOptions!)
  }

  public init(): void {
    this.mount?.init()
  }

  public next() {}

  public prev() {}

  public goTo(index: number) {}

  public play() {}

  public pause() {}

  public stop() {}

  public destroy() {}
}
//public clonedSlides: HTMLElement[] = []

//style peek

//https://github.com/nolimits4web/swiper/issues/5236
