import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { CLASS_VALUES, EVENTS, FROM, TAGS } from "./helpers"
import {
  addClass,
  appendToParent,
  calcNumberOfSlides,
  getAllElements,
  getDotsContainer,
  getSliderNodeList,
  hasClass,
  listener
} from "./helpers"

export class Dots extends BaseSlider {
  private slider: Slider
  private containerDots: HTMLElement | undefined
  public slides: HTMLElement[]

  constructor($root: string) {
    super($root)
    this.slider = new Slider($root)
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

  /*private calculateDots(): number {
    const { slidesPerView, slidesPerPage, infinite } = this.store

    // Número de slides reais (excluindo clones)
    const numberOfActualSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    // Validação inicial para evitar cálculos inválidos
    if (numberOfActualSlides <= 0 || slidesPerPage <= 0 || slidesPerView <= 0) {
      return 0
    }

    // Cálculo correto para modo infinito e não infinito
    let totalPages = 0

    if (infinite) {
      // No modo infinito, o número de páginas deve ser baseado no total de slides
      // Cada dot representa uma "página" completa de slides
      totalPages = Math.ceil(numberOfActualSlides / slidesPerPage)
    } else {
      // No modo não infinito, o número de páginas é baseado em quantos grupos de slidesPerPage podemos mostrar
      // considerando que você já tem slidesPerView visíveis inicialmente
      totalPages = Math.ceil(
        (numberOfActualSlides - slidesPerView + slidesPerPage) / slidesPerPage
      )
    }

    return Math.max(1, totalPages)
  }*/

  private calculateDots(): number {
    const { slidesPerView, slidesPerPage, infinite } = this.store
    const { leftOver } = this.getMissingSlides()

    // Número de slides reais (sem clones)
    const numberOfActualSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    // Validação inicial para evitar cálculos inválidos
    if (numberOfActualSlides <= 0 || slidesPerPage <= 0 || slidesPerView <= 0) {
      return 0
    }

    let totalPages = 0

    if (infinite) {
      // Modo infinito → simplesmente divide pelos slidesPerPage
      totalPages = Math.ceil(numberOfActualSlides / slidesPerPage)
    } else {
      // Modo não infinito → primeira página é a visível (slidesPerView),
      // depois avança de slidesPerPage em slidesPerPage
      totalPages =
        Math.ceil((numberOfActualSlides - slidesPerView) / slidesPerPage) + 1
    }

    return Math.max(1, totalPages)
  }

  private createDots(): void {
    // Verifica se existe ao menos um dot no HTML inicial
    const existingDots = getAllElements<HTMLElement>(
      TAGS.LI,
      this.containerDots
    )

    if (existingDots.length === 0) return

    // Pega o primeiro dot como modelo
    const templateDot = existingDots[0]
    const numberOfDots = this.calculateDots()

    this.setState({ numberOfPages: numberOfDots })

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

  private dotHandler(touchIndex: number): void {
    this.setState(this.currentEventType())
    this.movement = true

    this.slider.goToDotIndex(touchIndex)
    this.slider.updateSlider()
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

  // Em modo normal usamos as posições válidas reais do viewport.
  // Em modo infinite cada dot representa uma página cíclica de `slidesPerPage`,
  // então o último dot precisa poder avançar para a direita até o grupo final.
  private getDotTargetIndex(dotIndex: number): number {
    const { slidesPerPage, slidesPerView, infinite } = this.store
    const realSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
    const totalSlides = realSlides.length
    const step = slidesPerPage || 1

    if (infinite) {
      const cyclicTargetIndex = Math.min(dotIndex * step, totalSlides - 1)

      return cyclicTargetIndex + this.slider.getInitialIndexFromClones()
    }

    const view = slidesPerView || 1
    const maxStartIndex = Math.max(totalSlides - view, 0)
    const positions: number[] = []

    for (let pos = 0; pos <= maxStartIndex; pos += step) positions.push(pos)
    if (!positions.includes(maxStartIndex)) positions.push(maxStartIndex)

    return positions[dotIndex] ?? maxStartIndex
  }

  private handleClick(dot: HTMLElement, dotIndex: number): void {
    listener([EVENTS.CLICK], dot, () => {
      const { infinite } = this.store
      const slideIndex = this.getDotTargetIndex(dotIndex)

      console.log(
        "dot clicked",
        dotIndex,
        "→ slideIndex",
        slideIndex,
        "infinite:",
        infinite
      )
      this.setState(this.slideIndexState(slideIndex))
      this.dotHandler(slideIndex)
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
