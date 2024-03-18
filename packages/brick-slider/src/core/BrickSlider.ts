import { Resize } from "@/event/Resize"
import { Methods } from "./Methods"
import { assert } from "@/error/assert"
import { State, StateType, State_Keys, TypeOptions } from "@/state/BrickState"
import { CLASS_VALUES, EVENTS } from "@/util/constants"
import { Dots } from "@/ui/Dots"
import { Arrows } from "@/ui/Arrows"
import { Touch } from "@/event/initTouch"
import { isValidSelector } from "@/util/isValidSelector"
import { listener } from "@/util/listener"
import { attr } from "./constant"
import { setIndexBypass } from "@/util/setIndexBypass"
import { addClass } from "@/dom/addClass"
import { getChildren } from "@/dom/getChildren"
import { getChildrenCount } from "@/dom/getChildrenCount"
import { getSliderWidth } from "@/dom/getSliderWidth"
import { removeClass } from "@/dom/removeClass"
import { appendToParent } from "@/dom/appendToParent"
import { getSlideNodeList } from "@/dom/getSlideNodeList"
import { setAttribute } from "@/dom/setAttribute"
import { setInnerHTML } from "@/dom/setInnerHTML"
import { Slides } from "./Slides"

export class BrickSlider extends Methods {
  private clonedSlides: HTMLElement[] = []
  private clonedSlide: any
  public $root: string
  private $children: HTMLElement
  public options?: TypeOptions
  private state: State
  private resize: Resize
  private slides: Slides
  public store: StateType

  constructor($root: string, options?: TypeOptions) {
    super()
    assert(isValidSelector($root), "Main Selector Not Found")
    this.$root = $root
    this.options = options
    this.state = new State(this.$root)
    this.store = State.store(this.$root)
    this.$children = getChildren(this.$root)
    this.clonedSlide = null
    this.slides = new Slides(this.$root)
    this.resize = new Resize(this.$root)
    if (options) this.state.setOptions(this.options!)
  }

  public init(): void {
    const { infinite, slideIndex, slidesPerPage } = this.store

    if (infinite) this.slides.cloneSlides()

    this.state.seti({
      [State_Keys.SliderWidth]: getSliderWidth(this.$children),
      [State_Keys.NumberOfSlides]: getChildrenCount(this.$children)
    })

    const slides = getSlideNodeList(this.$root)

    BrickSlider.setActiveSlide(slides, slideIndex, slidesPerPage)

    listener(EVENTS.RESIZE, window, () => this.resize.init())

    this.setAcessibility(this.$children)

    this.appendSlider(this.$children, this.clonedSlides)

    this.setControls(this.state.store)
  }

  private setAcessibility($children: HTMLElement): void {
    const { infinite, numberOfSlides, slidesPerPage } = this.store

    for (let i = 0; i < numberOfSlides; i++) {
      this.clonedSlide = this.$children.children[i].cloneNode(
        true
      ) as HTMLElement

      const { index, sliderCount } = this.calculateIndex(
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

  private calculateIndex(
    infinite: boolean,
    i: number,
    numberOfSlides: number,
    slidesPerPage: number
  ) {
    let index: number
    let sliderCount: number

    if (infinite) {
      index = setIndexBypass(i, numberOfSlides, slidesPerPage) + 1
      sliderCount = numberOfSlides - 2
    } else {
      index = i + 1
      sliderCount = numberOfSlides
    }
    return { index, sliderCount }
  }

  private appendSlider(container: HTMLElement, children: HTMLElement[]) {
    children.forEach(element => {
      appendToParent(container, element)
    })
  }

  public static setActiveSlide(
    slides: HTMLElement[],
    slideIndex: number,
    slidesPerPage: number
  ): void {
    let i = 0

    slides.forEach(slide => removeClass(slide, CLASS_VALUES.ACTIVE))

    for (i; i < slidesPerPage; i++) {
      const index = slideIndex * slidesPerPage + i
      addClass([slides[index]], CLASS_VALUES.ACTIVE)
    }
  }

  private setControls(this: any, options: any): void {
    const { dots, arrows, touch } = options || {}

    if (dots) new Dots(this.$root).init()
    if (arrows) new Arrows(this.$root).init()
    if (touch) new Touch(this.$root).init()
  }
}
