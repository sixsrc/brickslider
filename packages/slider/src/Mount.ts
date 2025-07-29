import { Arrows } from "./Arrows"

import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES, EVENTS, STYLES } from "./constants"
import {
  appendToParent,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  listener,
  removeClass,
  setAttributes
} from "./helpers"

import { Attributes, KeyframeAnimation } from "./types"
import { ContextMenu } from "./ContextMenu"

import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private clone: CloneSlides
  private slides: HTMLElement[]
  private mutate: Mutate

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clone = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
    this.mutate = new Mutate($root)
  }

  public init(): void {
    this.setState(this.mountState())
    this.setProperties()
    this.cloneSlides()
    this.appendSlider()
    // this.setControls()
    this.handleResize()
    this.endMount()
  }

  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAttr(index))
    })
  }

  private cloneSlides(): void {
    const { infinite } = this.store

    if (infinite) {
      this.clone.init()
      //this.slides = this.clone.getSlides()["slides"]
      this.slides = BaseSlider.getSlides(this.$root)
    }
  }

  private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1,
      role: "group"
    }
  }

  private appendSlider(): void {
    const { $children } = this

    this.clonedSlides.forEach((element: HTMLElement | undefined) => {
      appendToParent($children, element)
    })
  }

  private setControls(): void {
    const { dots, arrows, touch } = this.store
    const { $root } = this

    if ($root) {
    }
    new ContextMenu($root).init()
    if (dots) new Dots($root).init()
    if (arrows) new Arrows($root).init()
    if (touch) new Swipe($root).init()
  }

  protected keyFrames(index: number): KeyframeAnimation[] {
    const slideWidth = this.getSlideWidth()
    const { spacing } = this.store
    const isLastSlide = index === this.slides.length - 1

    return [
      {
        //  marginRight: isLastSlide ? "0px" : `${spacing}px`,
        marginRight: `${spacing}px`,
        width: `${slideWidth}px`,
        maxWidth: `100%`,
        boxSizing: "border-box"
      }
    ]
  }

  private getSlideWidth(): number {
    //slidesPerView * spacing

    const { spacing, slidesPerView, sliderWidth } = this.store
    const totalSpacing = (slidesPerView - 1) * spacing
    const availableWidth = sliderWidth - totalSpacing
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth) // Garantir que não seja negativo
  }

  private mountState(): Partial<StateType> {
    const { $children } = this

    return {
      sliderWidth: getSliderWidth($children!),
      numberOfSlides: getChildrenCount($children)
    }
  }

  private handleResize(): void {
    listener([EVENTS.RESIZE], window, () => this.resize.init())
  }

  private setVisibility(): void {
    removeClass(this.getRootSelector!, CLASS_VALUES.HIDE)
  }

  private setActiveSlides(): void {
    const visibleIndexes = this.getVisibleSlideIndexes()
    this.mutate.updateActiveSlides(visibleIndexes)
    //this.mutate.updateActiveSlides()
    //this.mutate.updateActiveSlides(null)
  }

  private getVisibleSlideIndexes(): number[] {
    const slides = this.slides
    const slidesPerPage = this.store.slidesPerPage || 1

    // encontra o índice do slide que tem data-index === "1"
    const startIndex = slides.findIndex(slide => slide.dataset.index === "1")

    // cria um array com os índices do startIndex até slidesPerPage
    return Array.from(
      { length: slidesPerPage },
      (_, i) => startIndex + i
    ).filter(i => i < slides.length) // garante que não ultrapasse o tamanho do array
  }

  private checkSlidesPerView() {
    this.setState({
      numberOfSlides: this.slides.length
    })
    const { slidesPerView, numberOfSlides } = this.store
    if (slidesPerView > numberOfSlides) {
    }
    // this.setState({ slidesPerView: numberOfSlides })
  }

  public setSlidesWidth(): void {
    this.slides.forEach((slide, index) => {
      this.animate(slide, this.keyFrames(index), this.options())
    })
  }

  private setPeekStyle(): void {
    this.animate(
      this.trackChildren,
      {
        transform: "scale(0.8)",
        paddingLeft: "4rem",
        paddingRight: "4rem"
      } as any,
      this.options()
    )
  }

  private endMount(): void {
    this.setActiveSlides()
    //this.setPeekStyle()
    this.checkSlidesPerView()
    this.setSlidesWidth()
    this.setVisibility()
    this.setControls()
  }
}
