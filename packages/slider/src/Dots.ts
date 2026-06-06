import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import {
  CLASS_VALUES,
  DOM_ELEMENT_ALIASES,
  EVENTS,
  FROM,
  TAGS
} from "./helpers"
import {
  addClass,
  appendToParent,
  calcNumberOfSlides,
  getAllElements,
  getDotsContainer,
  getSliderNodeList,
  hasClass,
  listener,
  removeClass
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

  private calculateDots(): number {
    const { slidesPerView, slidesPerPage, useLoop } = this.store
    const numberOfActualSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    ).length

    if (numberOfActualSlides <= 0 || slidesPerPage <= 0 || slidesPerView <= 0) {
      return 0
    }

    let totalPages = 0

    if (useLoop) {
      totalPages = Math.ceil(numberOfActualSlides / slidesPerPage)
    } else {
      totalPages =
        Math.ceil((numberOfActualSlides - slidesPerView) / slidesPerPage) + 1
    }

    return Math.max(1, totalPages)
  }

  private createDots(): void {
    const numberOfDots = this.calculateDots()
    const isDotsRenderable = this.canRenderDots()
    const paginationState = this.paginationState(numberOfDots)
    const templateDot = isDotsRenderable ? this.getTemplateDot() : undefined

    this.setState(paginationState)

    if (!isDotsRenderable) return
    if (!templateDot) return

    this.renderDots(templateDot, numberOfDots)
    this.setInitialActiveDot()
    this.setState(this.numOfSlidesState(numberOfDots))
  }

  private paginationState(numberOfDots: number): Partial<StateType> {
    const { dotIndex } = this.store
    const safeDotIndex = this.getSafeDotIndex(dotIndex, numberOfDots)

    return {
      numberOfPages: numberOfDots,
      dotIndex: safeDotIndex,
      activePage: safeDotIndex
    }
  }

  private getSafeDotIndex(
    dotIndex: number | undefined,
    numberOfDots: number
  ): number {
    return Math.max(0, Math.min(dotIndex ?? 0, Math.max(0, numberOfDots - 1)))
  }

  private canRenderDots(): boolean {
    const { dots: isDotsEnabled } = this.store

    return !!isDotsEnabled && !!this.containerDots
  }

  private getExistingDots(): NodeListOf<HTMLElement> {
    return getAllElements<HTMLElement>(TAGS.LI, this.containerDots)
  }

  private getTemplateDot(): HTMLElement | undefined {
    const existingDots = this.getExistingDots()

    if (existingDots.length === 0) return

    return existingDots[0].cloneNode(true) as HTMLElement
  }

  private renderDots(templateDot: HTMLElement, numberOfDots: number): void {
    this.clearExistingDots()

    for (let i = 0; i < numberOfDots; i++) {
      const dot = templateDot.cloneNode(true) as HTMLElement
      appendToParent(this.containerDots, dot)
    }
  }

  private clearExistingDots(): void {
    const existingDots = this.getExistingDots()

    Array.from(existingDots).forEach(dot => dot.remove())
  }

  private setInitialActiveDot(): void {
    const allDots = this.getExistingDots()

    allDots.forEach((dot, index) => {
      const isFirstDot = index === 0

      if (isFirstDot) {
        addClass([dot], CLASS_VALUES.SELECTED)
        addClass([dot], DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
        return
      }

      removeClass(dot, [
        CLASS_VALUES.SELECTED,
        DOM_ELEMENT_ALIASES.DOT_ACTIVE[0]
      ])
    })
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
    const { dots: isDotsEnabled } = this.store

    if (!isDotsEnabled) return
    if (!this.containerDots) return

    const dotElements = getAllElements<HTMLElement>(TAGS.LI, this.containerDots)

    Array.from(dotElements).forEach((dot, index) => {
      this.handleClick(dot, index)
    })
  }

  private getDotTargetIndex(dotIndex: number): number {
    const { slidesPerPage, slidesPerView, useLoop } = this.store
    const realSlides = this.slides.filter(
      slide => !hasClass(slide, CLASS_VALUES.CLONED)
    )
    const totalSlides = realSlides.length
    const step = slidesPerPage || 1

    if (useLoop) {
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
      const slideIndex = this.getDotTargetIndex(dotIndex)

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
    const { useLoop, slidesPerPage } = this.store
    const { $children } = this

    return {
      numberOfSlides: calcNumberOfSlides(useLoop, slidesPerPage, $children)
    }
  }
}
