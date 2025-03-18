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
  getDotsContainer,
  getSliderNodeList,
  listener,
  setAttribute
} from "./helpers"

export class Dots extends BaseSlider {
  private slider: Slider
  private sync: Sync
  private containerDots: HTMLElement | undefined
  public slides: HTMLElement[]

  constructor($root: string) {
    super($root)
    this.slider = new Slider($root)
    this.sync = new Sync($root)
    //this.containerDots = createNewElement(TAGS.UL)
    this.containerDots = getDotsContainer($root)
    this.slides = getSliderNodeList($root)
  }

  public init(): void {
    /*setAttribute(
      this.containerDots,
      ATTRIBUTES.CLASS,
      DOM_ELEMENTS.DOTS_SELECTOR.replace(".", "")
    )

    appendToParent(this.getRootSelector, this.containerDots)*/

    this.createDots()

    this.eventMount()
  }

  /*private calculateDots() {
    const { slidesPerPage, slidesPerView, infinite, numberOfSlides } =
      this.store
    const slides = BaseSlider.getSlides(this.$root, false)
    const pages = Math.ceil(slides.length / slidesPerView)
    const leftOver = slides.length % slidesPerPage

    console.log("numberOFSlides", numberOfSlides)

    if (slidesPerPage <= 0 || slidesPerView <= 0) return 0
    if (infinite) return pages
    // if (leftOver > 0) return pages - 1

    return pages
  }*/

  private calculateDots() {
    const { slidesPerPage, slidesPerView, numberOfSlides } = this.store

    if (slidesPerPage <= 0 || slidesPerView <= 0 || numberOfSlides <= 0)
      return 0

    // Calcular o número de dots
    const maxDots = Math.max(
      Math.ceil((numberOfSlides - slidesPerView) / slidesPerPage) + 1,
      1
    )

    return maxDots
  }

  //let dots = view === 1 ? pages : Math.max(1, pages - (view - slidesPerPage))

  // dots = isBlankSpace ? dots - 1 : dots

  //let calcValue = loop ? pages : Math.max(1, pages - (view - slidesPerPage))

  /* private createDots(): void {
    const numberOfDots = this.calculateDots()

    for (let i = 0; i < numberOfDots; i++) {
      const liDots = createNewElement(TAGS.LI)

      appendToParent(this.containerDots, liDots)
      addClass([liDots], CLASS_VALUES.SLIDER_DOT)

      if (i === 0) addClass([liDots], CLASS_VALUES.SELECTED)
    }

    this.setState(this.numOfSlidesState(numberOfDots))
  }*/

  private createDots(): void {
    // Verifica se existe ao menos um dot no HTML inicial
    const existingDots = getAllElements<HTMLElement>(
      TAGS.LI,
      this.containerDots
    )

    if (existingDots.length === 0) {
      console.error(
        "O HTML inicial deve conter pelo menos um dot para estilização."
      )
      return
    }

    // Pega o primeiro dot como modelo
    const templateDot = existingDots[0]
    const numberOfDots = this.calculateDots()

    // Remove todos os dots existentes no HTML, exceto o template
    Array.from(existingDots).forEach((dot, index) => {
      if (index > 0) dot.remove()
    })

    // Duplica o dot template conforme necessário
    for (let i = 1; i < numberOfDots; i++) {
      const clonedDot = templateDot.cloneNode(true) as HTMLElement
      appendToParent(this.containerDots, clonedDot)
    }

    // Adiciona a classe `slider__dot--active` ao primeiro dot
    const allDots = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)
    allDots.forEach((dot, index) => {
      if (index === 0) addClass([dot], CLASS_VALUES.SELECTED)
      else dot.classList.remove(CLASS_VALUES.SELECTED)
    })

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
