import { Arrows } from "./Arrows"
import { BaseSlider } from "./BaseSlider"
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
  setAttributes,
  toggleClass
} from "./helpers"

import { Attributes, KeyframeAnimation } from "./types"
import { ContextMenu } from "./ContextMenu"
import { Slider } from "./Slider"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private clone: CloneSlides
  private slides: HTMLElement[]
  contextMenu: ContextMenu

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this.clone = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
    this.contextMenu = new ContextMenu($root)
  }

  public init(): void {
    this.setState(this.mountState())
    this.setProperties()
    this.cloneSlides()
    this.appendSlider()
    this.setControls()
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
      this.slides = Slider.getSlides(this.$root)
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

  protected keyFrames(): KeyframeAnimation[] {
    let slideWidth = this.getSlideWidth()
    slideWidth = slideWidth

    return [
      {
        width: `${slideWidth}px`,
        maxWidth: `100%`
      }
    ]
  }

  private getSlideWidth(): number {
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
      //isInitialRender: true
    }
  }

  private handleResize(): void {
    listener([EVENTS.RESIZE], window, () => this.resize.init())
  }

  private setVisibility(): void {
    removeClass(this.getRootSelector!, CLASS_VALUES.HIDE)
  }

  private setToggleClass(): void {
    const { infinite, slideIndex, slidesPerPage } = this.store
    const { slides } = this
    const index = infinite ? 0 : slideIndex

    toggleClass(slides, index, slidesPerPage)
  }

  public setSlidesWidth(): void {
    this.slides.forEach(slide => {
      this.animate(slide, this.keyFrames(), this.options())
    })
  }

  private setPeekStyle(): void {
    this.animate(this.$children, { scale: STYLES.PEEK } as any, this.options())
  }

  private endMount(): void {
    this.setToggleClass()
    this.setPeekStyle()
    this.setSlidesWidth()
    this.setVisibility()
  }
}
