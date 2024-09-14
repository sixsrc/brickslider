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
  getChildrenCount,
  getSliderNodeList,
  getSliderWidth,
  listener,
  removeClass,
  removeProperty,
  setAttributes,
  setProperty,
  setStyle,
  toggleClass
} from "./helpers"
import { Center } from "./Center"

export class Mount extends BaseSlider {
  private clonedSlides: HTMLElement[] = []
  private resize: Resize
  private _cloneSlides: CloneSlides
  private slides: HTMLElement[]
  center: any

  constructor($root: string) {
    super($root)
    this.slides = getSliderNodeList(this.$root)
    this._cloneSlides = new CloneSlides(this.$root)
    this.resize = new Resize(this.$root)
    this.center = new Center($root)
  }

  public init() {
    this.setState(this.mountState())
    this.setProperties()
    this.cloneSlides()
    this.appendSlider(this.$children, this.clonedSlides)
    removeClass(this.getRootSelector!, CLASS_VALUES.HIDE)
    this.setControls(this.store)
    this.slides = getSliderNodeList(this.$root)
    const { spacing, slidesPerPage, sliderWidth } = this.store
    const isMultiplePerPage = slidesPerPage >= 2
    const calcWidth = sliderWidth / slidesPerPage - spacing / slidesPerPage
    const slideWidth = isMultiplePerPage ? calcWidth : sliderWidth

    this.slides!.forEach(slide => {
      slide.animate([{ marginRight: "20px", maxWidth: `${slideWidth}px` }], {
        duration: 0,
        fill: "forwards"
      })
    })

    this.handleResize()
    this.updateDOM()
  }

  private setProperties(): void {
    this.slides.forEach((slide, index) => {
      setAttributes(slide, this.setAttr(index))
      // this.setTempStyle(slide)
      //this.disableStyle(slide)
    })
  }

  private setTempStyle(slide: HTMLElement) {
    const { slidesPerPage } = this.store
    const isMultipleSlides = slidesPerPage >= 2

    isMultipleSlides && setProperty(slide, "--gap", "20px")
  }

  private cloneSlides() {
    const { infinite } = this.store

    if (infinite) this._cloneSlides.init()
  }

  private setAttr(index: number) {
    const { numberOfSlides } = this.store

    return {
      "aria-label": `slide ${index + 1} of ${numberOfSlides}`,
      "aria-hidden": "true",
      role: "group",
      "data-index": index + 1
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

  private disableStyle(slide: HTMLElement) {
    const { slidesPerPage } = this.store
    const isMultipleSlides = slidesPerPage >= 2

    isMultipleSlides && removeProperty(slide, "--gap")
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

/*
private updateDataIndexes(slides: HTMLElement[], slidesPerPage: number) {
    let groupIndex = 0

    slides.forEach((slide, index) => {
      const isStartOfGroup = index % slidesPerPage === 0

      if (slide.classList.contains("cloned")) groupIndex = 0

      if (
        isStartOfGroup &&
        index !== 0 &&
        !slide.classList.contains("cloned")
      ) {
        groupIndex++
      }

      slide.setAttribute("data-index", String(groupIndex))
    })
  }

*/

/*
 if (this.store.slidesPerPage > 1) {
      const containerWidth: number = this.$children.clientWidth ?? 0

      // Atualize a lista de slides após clonar
      this.slides = getSliderNodeList(this.$root)

      // Filtrar slides visíveis
      const visibleSlides = Array.from(this.slides).filter(
        (slide: HTMLElement) => {
          const rect = slide.getBoundingClientRect()

          const isVisible =
            (rect.left >= 0 && rect.left < containerWidth) || // Left está visível
            (rect.right > 0 && rect.right <= containerWidth) || // Right está visível
            (rect.left < 0 && rect.right > containerWidth) // Slide cobre todo o container

          return isVisible
        }
      )

      // Retornar a quantidade de slides visíveis
      console.log(`Quantidade de slides visíveis: ${visibleSlides.length}`)

      // Retornar os elementos que estão visíveis
      console.log("Slides visíveis:", visibleSlides)
    }


*/
