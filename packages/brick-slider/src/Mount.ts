import { Arrows } from "./Arrows"
import { BaseSlider } from "./BaseSlider"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { Slides } from "./Slides"
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

export class Mount extends BaseSlider {
  public clonedSlides: HTMLElement[] = []
  private resize: Resize
  private _slides: Slides
  private slides: HTMLElement[]

  constructor($root: string) {
    super($root)
    this._slides = new Slides(this.$root)
    this.slides = getSliderNodeList(this.$root)
    this.resize = new Resize(this.$root)
  }

  public init() {
    this._init()
  }

  private _init() {
    const { $children, clonedSlides, store } = this
    const state = this.mountSlideState()

    this.setState(state)
    this.setAcessibility()
    this.cloneSlides()
    this.appendSlider($children, clonedSlides)
    this.enableControls(store)
    this.handleResize()
    this.updateDOM()
  }

  private setAcessibility(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAria(index))
    })
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

  private enableControls(this: any, options: any): void {
    const { dots, arrows, touch } = options
    const { $root } = this

    if (dots) new Dots($root).init()
    if (arrows) new Arrows($root).init()
    if (touch) new Swipe($root).init()
  }

  private cloneSlides() {
    const { infinite } = this.store

    if (infinite) this._slides.cloneSlides()
  }

  protected setState(state: Partial<StateType>): void {
    this.state.set(state)
  }

  protected mountSlideState(): Partial<StateType> {
    const { $children } = this

    return {
      sliderWidth: getSliderWidth($children!),
      numberOfSlides: getChildrenCount($children)
    }
  }

  protected updateDOM() {
    const { infinite, slideIndex, slidesPerPage } = this.store
    const { slides } = this
    const index = infinite ? 0 : slideIndex

    toggleClass(slides, index, slidesPerPage)
  }

  private handleResize(): void {
    listener([EVENTS.RESIZE], window, () => this.resize.init())
  }
}
