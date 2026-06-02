import { Arrows } from "./Arrows"
import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES, EVENTS } from "./constants"
import {
  appendToParent,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
  listener,
  removeClass,
  setAttributes,
  waitFor
} from "./helpers"
import { Attributes, KeyframeAnimation } from "./types"
import { ContextMenu } from "./ContextMenu"
import { BaseSlider } from "./BaseSlider"
import { Mutate } from "./Mutate"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private clone: CloneSlides
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
    this.normalizeSlidesConfig()
    this.setProperties()
    this.cloneSlides()
    this.appendSlider()
    this.handleResize()
    this.endMount()
  }

  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAttr(index))
    })
  }
  private normalizeSlidesConfig(): void {
    const { slidesPerPage: originalPerPage, slidesPerView: originalPerView } =
      this.store
    const totalSlides = this.slidesArr.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    if (originalPerView > totalSlides)
      this.setState({ slidesPerView: totalSlides })

    if (originalPerView + originalPerPage <= totalSlides) {
      this.setState({
        slidesPerPage: originalPerPage,
        slidesPerView: originalPerView
      })
      return
    }
  }

  private cloneSlides(): void {
    const { infinite } = this.store

    if (infinite) {
      this.clone.init()
      this.slides = BaseSlider.getSlides(this.$root)
    }
  }

  private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store
    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1,
      "data-slide-number": index + 1,
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

  protected keyFrames(index: number): KeyframeAnimation[] {
    const slideWidth = this.getSlideWidth()
    const { spacing } = this.store

    return [
      {
        marginRight: `${spacing}px`,
        width: `${slideWidth}px`,
        maxWidth: `100%`,
        boxSizing: "border-box"
      }
    ]
  }

  private getSlideWidth(): number {
    const { spacing, slidesPerView, sliderWidth } = this.store
    const totalSpacing = (slidesPerView - 1) * spacing
    const availableWidth = sliderWidth - totalSpacing
    const slideWidth = availableWidth / slidesPerView

    return Math.max(0, slideWidth)
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
    const visibleDataIndexes = visibleIndexes.map(i => {
      const slide = this.slides[i]
      return Number(slide?.dataset.slideNumber)
    })

    this.mutate.updateActiveSlides(visibleDataIndexes)
  }

  private setPeekStyle(): void {
    this.animate(this.$track, {} as any, this.options())
  }

  public setSlidesWidth(): void {
    this.slides.forEach((slide, index) => {
      this.animate(slide, this.keyFrames(index), this.options())
    })
  }

  private getVisibleSlideIndexes(): number[] {
    const slidesPerPage = this.store.slidesPerPage || 1
    const firstVisibleIndex = this.slides.findIndex(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    return Array.from(
      { length: slidesPerPage },
      (_, i) => firstVisibleIndex + i
    )
  }

  private endMount(): void {
    this.setActiveSlides()
    this.setPeekStyle()
    this.setSlidesWidth()
    this.setSlidesWidth()
    this.setVisibility()
    this.setControls()
  }
}

/*private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1,
      "data-slide-number": index + 1,
      role: "group"
    }
  }*/
