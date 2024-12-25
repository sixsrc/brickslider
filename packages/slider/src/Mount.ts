import { Arrows } from "./Arrows"
import { BaseSlider } from "./BaseSlider"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES, EVENTS } from "./constants"
import {
  appendToParent,
  calcWidth,
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
    //this.mapSlidePager()
    this.handleResize()
    this.updateDOM()
  }

  private getMissingSlides(): number {
    const { numberOfSlides, slidesPerPage } = this.store
    const remainder = numberOfSlides % slidesPerPage

    return remainder === 0 ? 0 : slidesPerPage - remainder
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
      this.slides = this.clone.getSlides()["slides"]
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

    if ($root) new ContextMenu($root).init()
    if (dots) new Dots($root).init()
    if (arrows) new Arrows($root).init()
    if (touch) new Swipe($root).init()
  }

  protected keyFrames(): KeyframeAnimation[] {
    const { spacing } = this.store
    let slideWidth = this.getSlideWidth()

    slideWidth = slideWidth

    return [
      {
        //marginLeft: "0px",
        // marginRight: `${spacing}px`,
        width: `${slideWidth}px`,
        maxWidth: `${slideWidth}px`
      }
    ]
  }

  private getSlideWidth(): number {
    const { spacing, slidesPerPage, slidesPerView, sliderWidth } = this.store

    // Espaço total ocupado pelos gaps
    const totalSpacing = (slidesPerView - 1) * spacing

    // Largura disponível para os slides (subtraindo os gaps)
    const availableWidth = sliderWidth - totalSpacing

    // Largura de cada slide
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth) // Garantir que não seja negativo
  }

  /*private getSlideWidth(): number {
    const { spacing, slidesPerPage, sliderWidth } = this.store
    const width = calcWidth(sliderWidth, slidesPerPage, spacing)
    const isMultipleSlides = slidesPerPage >= 2

    return isMultipleSlides ? width : sliderWidth
  }*/

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

  private setToggleClass(): void {
    const { infinite, slideIndex, slidesPerPage } = this.store
    const { slides } = this
    const index = infinite ? 0 : slideIndex

    toggleClass(slides, index, slidesPerPage)
  }

  public setWAAPIStyles(): void {
    const { spacing } = this.store
    const slideWidth = this.getSlideWidth()
    this.slides.forEach(slide => {
      this.animate(slide, this.keyFrames(), this.options())
      //slide.style.width = `${slideWidth}px`
      //slide.style.marginRight = `${spacing}px`
    })
  }

  private updateDOM(): void {
    this.setVisibility()
    this.setToggleClass()
    this.setWAAPIStyles()
  }
}
