import { Arrows } from "./Arrows"
import { BaseSlider } from "./BaseSlider"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { Slides } from "./Slides"
import { State_Keys } from "./State"
import { Swipe } from "./Swipe"
import { EVENTS } from "./constants"
import {
  appendToParent,
  attr,
  calcIndex,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  listener,
  setAttribute,
  setInnerHTML,
  toggleClass
} from "./helpers"

export class Mount extends BaseSlider {
  public clonedSlides: HTMLElement[] = []
  private resize: Resize
  private events: Slides
  private slides: HTMLElement[]

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.events = new Slides(this.$root)
    this.resize = new Resize(this.$root)
  }

  public init() {
    const { slideIndex, slidesPerPage } = this.store
    this.setState()
    this.updateDOM().toggleClass(this.slides, slideIndex, slidesPerPage)
    this.setAcessibility(this.$children)
    this.appendSlider(this.$children, this.clonedSlides)
    this.enableControls(this.store)
    this.setSlideEvents(this.clonedSlides)
    this.handleResize()
  }

  public setAcessibility($children: HTMLElement): void {
    const { infinite, numberOfSlides, slidesPerPage } = this.store

    for (let i = 0; i < numberOfSlides; i++) {
      const clonedSlide = this.$children.children[i].cloneNode(
        true
      ) as HTMLElement

      const { index, sliderCount } = calcIndex(
        infinite,
        i,
        numberOfSlides,
        slidesPerPage
      )

      for (const [key, value] of Object.entries(attr(index, sliderCount))) {
        setAttribute(clonedSlide, key, value)
      }

      this.clonedSlides.push(clonedSlide)
    }
    setInnerHTML($children, "")
  }

  public appendSlider(container: HTMLElement, children: HTMLElement[]): void {
    children.forEach(element => {
      appendToParent(container, element)
    })
  }

  public enableControls(this: any, options: any): void {
    const { dots, arrows, touch } = options || {}

    if (dots) new Dots(this.$root).init()
    if (arrows) new Arrows(this.$root).init()
    if (touch) new Swipe(this.$root).init()
  }

  protected setState(): void {
    this.state.set({
      [State_Keys.SliderWidth]: getSliderWidth(this.$children),
      [State_Keys.NumberOfSlides]: getChildrenCount(this.$children)
    })
  }

  protected updateDOM() {
    return {
      toggleClass: (
        slides: HTMLElement[],
        slideIndex: number,
        slidesPerPage: number
      ) => toggleClass(slides, slideIndex, slidesPerPage)
    }
  }

  private setSlideEvents(clonedSlides: HTMLElement[]) {
    this.events.setSlideEvents(clonedSlides)
  }

  private handleResize(): void {
    listener([EVENTS.RESIZE], window, () => this.resize.init())
  }
}
