import { Arrows } from "./Arrows"
import { BaseSlider } from "./BaseSlider"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { EVENTS } from "./constants"
import {
  appendToParent,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  listener,
  setAttributes,
  toggleClass
} from "./helpers"
import { Draggable } from "./Draggable"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private _cloneSlides: CloneSlides
  private slides: HTMLElement[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this._cloneSlides = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
  }

  public init() {
    this.setState(this.mountState())
    this.setAcessibility()
    this.cloneSlides()
    this.appendSlider(this.$children, this.clonedSlides)
    this.setControls(this.store)
    this.handleResize()
    this.updateDOM()
  }

  private setAcessibility(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAria(index))
    })
  }

  private cloneSlides() {
    const { infinite } = this.store

    if (infinite) this._cloneSlides.init()
  }

  private setAria(index: number) {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      role: "group"
    }
  }

  private appendSlider(
    container: HTMLElement | undefined,
    children: HTMLElement[]
  ): void {
    children.forEach(element => {
      appendToParent(container, element)
    })
  }

  private setControls(this: any, options: any): void {
    const { dots, arrows, touch } = options
    const { $root } = this

    if (dots) new Dots($root).init()
    if (arrows) new Arrows($root).init()
    if (touch) new Swipe($root).init()
  }

  protected mountState(): Partial<StateType> {
    const { $children } = this

    return {
      sliderWidth: getSliderWidth($children!),
      numberOfSlides: getChildrenCount($children)
    }
  }

  private handleResize(): void {
    listener([EVENTS.RESIZE], window, () => this.resize.init())
  }

  protected updateDOM() {
    const { infinite, slideIndex, slidesPerPage } = this.store
    const { slides } = this
    const index = infinite ? 0 : slideIndex

    toggleClass(slides, index, slidesPerPage)
  }
}
