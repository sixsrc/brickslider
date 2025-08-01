import { Arrows } from "./Arrows"

import { Dots } from "./Dots"
import { Resize } from "./Resize"
import { CloneSlides } from "./CloneSlides"
import { StateType } from "./State"
import { Swipe } from "./Swipe"
import { CLASS_VALUES, EVENTS } from "./constants"
import {
  addClass,
  appendToParent,
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  hasClass,
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
      this.slides = BaseSlider.getSlides(this.$root)
    }
  }

  /* private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1,
      role: "group"
    }
  }*/

  private setAttr(index: number): Attributes {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      "data-index": index + 1, // Convertido para string
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
      return Number(slide?.dataset.index)
    })

    this.mutate.updateActiveSlides(visibleDataIndexes)

    const slidesWithActiveClass = this.slidesArr.filter(slide =>
      hasClass(slide, CLASS_VALUES.ACTIVE)
    )

    slidesWithActiveClass.forEach(slide => {
      addClass([slide], "isVisible")
    })
  }
  //this.mutate.updateActiveSlides(visibleIndexes)
  /*private getVisibleSlideIndexes(): number[] {
    const slides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
    const slidesPerPage = this.store.slidesPerPage || 1

    const startIndex = slides.findIndex(slide => slide.dataset.index === "1")

    return Array.from(
      { length: slidesPerPage },
      (_, i) => startIndex + i
    ).filter(i => i < slides.length)
  }
*/
  public setSlidesWidth(): void {
    this.slides.forEach((slide, index) => {
      this.animate(slide, this.keyFrames(index), this.options())
    })
  }

  private fixDataIndexes(): void {
    const allSlides = Array.from(
      this.$children?.children || []
    ) as HTMLElement[]

    allSlides.forEach(slide => {
      const ariaLabel = slide.getAttribute("aria-label")
      if (ariaLabel) {
        // Extrai o número antes do "of" usando regex
        const match = ariaLabel.match(/slide (\d+) of/)
        if (match) {
          const slideNumber = match[1]
          slide.setAttribute("data-index", slideNumber)
        }
      }
    })
  }

  private getVisibleSlideIndexes(): number[] {
    const slidesPerPage = this.store.slidesPerPage || 1

    // Encontra o primeiro slide visível real (não clonado)
    const firstVisibleIndex = this.slides.findIndex(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )

    console.log("firstVisibleIndex", this.$root, firstVisibleIndex)

    // Coleta os próximos N slides
    return Array.from(
      { length: slidesPerPage },
      (_, i) => firstVisibleIndex + i
    )
  }

  private endMount(): void {
    this.setActiveSlides()
    this.setSlidesWidth()
    this.setVisibility()
    this.setControls()
    // this.fixDataIndexes()
  }
}
