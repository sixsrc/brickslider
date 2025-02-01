import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import {
  ATTRIBUTES,
  CLASS_VALUES,
  DOM_ELEMENTS,
  EVENTS,
  FROM,
  TAGS
} from "./constants"
import { Sync } from "./Sync"
import {
  addClass,
  appendToParent,
  calcNumberOfSlides,
  createNewElement,
  getAllElements,
  getSliderNodeList,
  listener,
  setAttribute
} from "./helpers"

export class Dots extends BaseSlider {
  private slider: Slider
  private sync: Sync
  private containerDots: HTMLElement
  public slides: HTMLElement[]

  constructor($root: string) {
    super($root)
    this.slider = new Slider($root)
    this.sync = new Sync($root)
    this.containerDots = createNewElement(TAGS.UL)
    this.slides = getSliderNodeList($root)
  }

  public init(): void {
    setAttribute(
      this.containerDots,
      ATTRIBUTES.CLASS,
      DOM_ELEMENTS.DOTS_SELECTOR.replace(".", "")
    )

    appendToParent(this.getRootSelector, this.containerDots)

    this.createDots()

    this.eventMount()
  }

  private calculateDots() {
    const { slidesPerPage, slidesPerView: view, infinite: loop } = this.store
    const slides = getSliderNodeList(this.$root, false)
    const pages = Math.ceil(slides.length / slidesPerPage)
    let calcValue = loop ? pages : Math.max(1, pages - (view - slidesPerPage))

    if (slidesPerPage <= 0 || view <= 0) return 0

    if (loop) return pages

    const dots =
      view === 1 ? pages : Math.max(1, pages - (view - slidesPerPage))

    return dots
  }

  private createDots(): void {
    const numberOfDots = this.calculateDots()

    for (let i = 0; i < numberOfDots; i++) {
      const liDots = createNewElement(TAGS.LI)

      appendToParent(this.containerDots, liDots)
      addClass([liDots], CLASS_VALUES.SLIDER_DOT)

      if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
    }

    this.setState(this.numOfSlidesState(numberOfDots))
  }

  private dotHandler(): void {
    const { $root, sync } = this
    const touchIndex = this.store.slideIndex

    this.setState(this.currentEventType())

    this.movement = true

    if (sync.now()) sync.handleJumpSlide()
    else this.slider.setSlideTarget({ touchIndex, $root })

    this.slider.updateDots($root)
  }

  private numOfSlidesState(numberOfSlides: number): Partial<StateType> {
    return {
      numberOfSlides
    }
  }

  private eventMount() {
    const dots = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)

    Array.from(dots).forEach((dot, index) => {
      this.handleClick(dot, index)
    })
  }

  private handleClick(dot: HTMLElement, index: number): void {
    listener([EVENTS.CLICK], dot, () => {
      this.setState(this.slideIndexState(index))
      this.dotHandler()
    })
  }

  protected currentEventType(): Partial<StateType> {
    return {
      currentEventType: FROM.DOTS
    }
  }

  protected slideIndexState(index: number): Partial<StateType> {
    return { slideIndex: index }
  }

  protected numberOfSlidesState(): Partial<StateType> {
    const { infinite, slidesPerPage } = this.store
    const { $children } = this

    return {
      numberOfSlides: calcNumberOfSlides(infinite, slidesPerPage, $children)
    }
  }
}

/* private createDots(): void {
    const { slidesPerPage, slidesPerView, numberOfSlides } = this.store
    const { containerDots, $root } = this
    const slides = getSliderNodeList($root, false)
    // const numberOfSlides = Math.ceil(slides.length / slidesPerPage)

    for (let i = 0; i < numberOfSlides; i++) {
      const liDots = createNewElement(TAGS.LI)

      appendToParent(containerDots, liDots)

      addClass([liDots], CLASS_VALUES.SLIDER_DOT)

      if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
    }
  }*/

/*private createDots(): void {
    const { slidesPerPage, slidesPerView, numberOfSlides } = this.store
    const { containerDots, $root } = this

    // Calcula o número total de páginas baseado nos slides agrupados
    const numberOfPages = Math.ceil(
      (numberOfSlides - slidesPerView) / slidesPerPage + 1
    )

    console.log("numberOfPages", numberOfPages)

    for (let i = 0; i < numberOfPages; i++) {
      const liDots = createNewElement(TAGS.LI)

      appendToParent(containerDots, liDots)
      addClass([liDots], CLASS_VALUES.SLIDER_DOT)

      if (i === 0) {
        addClass([liDots], CLASS_VALUES.SELECTED)
      }
    }
  }
*/

/*private calculateDots() {
    // Verifica se os parâmetros são válidos
    const { slidesPerPage, slidesPerView } = this.store
    const slides = getSliderNodeList(this.$root, false)

    if (slidesPerPage <= 0 || slidesPerView <= 0) {
      console.error(
        "Os valores de slidesPerPage e slidesPerView devem ser maiores que 0."
      )
      return 0
    }

    // Calcula o número de páginas baseado nos slides por página
    const numberOfPages = Math.ceil(slides.length / slidesPerPage)

    // Ajuste para lidar com número par de slides
    let numberOfDots = numberOfPages

    if (this.slides.length % 2 !== 0) {
      // Se o número de slides for ímpar, aplicar o cálculo atual
      numberOfDots = Math.max(1, numberOfPages - slidesPerView + 1)
    }

    return numberOfDots
  }*/
// this.setState(this.currentEventType())
//this.startPosState()
/*private startPosState(): Partial<StateType> {
  return {
    startPos: 0
  }
}*/
