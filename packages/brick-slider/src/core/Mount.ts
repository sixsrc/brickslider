import { State_Keys } from "@/state/BrickState"
import { Base } from "./Base"
import { getChildrenCount } from "@/dom/getChildrenCount"
import { getSliderWidth } from "@/dom/getSliderWidth"
import { Arrows } from "@/ui/Arrows"
import { Dots } from "@/ui/Dots"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { EVENTS } from "@/util/constants"
import { appendToParent } from "@/dom/appendToParent"
import { setInnerHTML } from "@/dom/setInnerHTML"
import { setAttribute } from "@/dom/setAttribute"
import { attr } from "./constant"
import { Touch } from "@/event/initTouch"
import { listener } from "@/util/listener"
import { Resize } from "@/event/Resize"
import { calcIndex } from "@/util/calcIndex"
import { toggleActiveClass } from "@/util/toggleActiveClass"

export class Mount extends Base {
  public clonedSlides: HTMLElement[] = []
  private clonedSlide: any
  private resize: Resize

  constructor($root: string) {
    super($root)
    this.clonedSlide = null
    this.resize = new Resize(this.$root)
  }

  public init() {
    this.setState()
    this.updateDOM()
    this.setAcessibility(this.$children)
    this.appendSlider(this.$children, this.clonedSlides)
    this.enableControls(this.store)
    this.handleResize()
  }

  public setAcessibility($children: HTMLElement): void {
    const { infinite, numberOfSlides, slidesPerPage } = this.store

    for (let i = 0; i < numberOfSlides; i++) {
      this.clonedSlide = this.$children.children[i].cloneNode(
        true
      ) as HTMLElement

      const { index, sliderCount } = calcIndex(
        infinite,
        i,
        numberOfSlides,
        slidesPerPage
      )

      for (const [key, value] of Object.entries(attr(index, sliderCount))) {
        setAttribute(this.clonedSlide, key, value)
      }
      this.clonedSlides.push(this.clonedSlide)
    }
    setInnerHTML($children, "")
  }

  public appendSlider(container: HTMLElement, children: HTMLElement[]) {
    children.forEach(element => {
      appendToParent(container, element)
    })
  }

  public enableControls(this: any, options: any): void {
    const { dots, arrows, touch } = options || {}

    if (dots) new Dots(this.$root).init()
    if (arrows) new Arrows(this.$root).init()
    if (touch) new Touch(this.$root).init()
  }

  protected setState() {
    this.state.set({
      [State_Keys.SliderWidth]: getSliderWidth(this.$children),
      [State_Keys.NumberOfSlides]: getChildrenCount(this.$children)
    })
  }

  protected updateDOM() {
    const slides = getSlideNodeList(this.$root)
    const { slideIndex, slidesPerPage } = this.store

    toggleActiveClass(slides, slideIndex, slidesPerPage)
  }

  private handleResize() {
    listener(EVENTS.RESIZE, window, () => this.resize.init())
  }
}
