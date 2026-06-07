import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import type { StateType } from "./types"
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
  removeClass,
  removeElement
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
    this.createDots()
    this.eventMount()
  }

  private calculateDots(): number {
    const { slidesPerView, slidesPerPage, useLoop } = this.store
    const numberOfActualSlides = this.getActualSlideCount()
    const totalPages = this.getTotalPages(
      useLoop,
      numberOfActualSlides,
      slidesPerPage,
      slidesPerView
    )

    if (
      !this.canCalculateDots(numberOfActualSlides, slidesPerPage, slidesPerView)
    )
      return 0

    return this.getSafeTotalPages(totalPages)
  }

  private getTotalPages(
    useLoop: boolean,
    numberOfActualSlides: number,
    slidesPerPage: number,
    slidesPerView: number
  ): number {
    return useLoop
      ? this.getLoopTotalPages(numberOfActualSlides, slidesPerPage)
      : this.getPagedTotalPages(
          numberOfActualSlides,
          slidesPerPage,
          slidesPerView
        )
  }

  private getActualSlideCount(): number {
    return this.slides.filter(slide => !hasClass(slide, CLASS_VALUES.CLONED))
      .length
  }

  private canCalculateDots(
    numberOfActualSlides: number,
    slidesPerPage: number,
    slidesPerView: number
  ): boolean {
    return numberOfActualSlides > 0 && slidesPerPage > 0 && slidesPerView > 0
  }

  private getLoopTotalPages(
    numberOfActualSlides: number,
    slidesPerPage: number
  ): number {
    return Math.ceil(numberOfActualSlides / slidesPerPage)
  }

  private getPagedTotalPages(
    numberOfActualSlides: number,
    slidesPerPage: number,
    slidesPerView: number
  ): number {
    return Math.ceil((numberOfActualSlides - slidesPerView) / slidesPerPage) + 1
  }

  private getSafeTotalPages(totalPages: number): number {
    return Math.max(1, totalPages)
  }

  private createDots(): void {
    const numberOfDots = this.calculateDots()
    const isDotsRenderable = this.canRenderDots()
    const paginationState = this.paginationState(numberOfDots)
    const templateDot = isDotsRenderable ? this.getTemplateDot() : undefined
    const canCreateDots = this.canCreateDots(isDotsRenderable, templateDot)

    this.applyPaginationState(paginationState, numberOfDots)
    if (!canCreateDots) return
    this.renderDots(templateDot, numberOfDots)
    this.setInitialActiveDot()
  }

  private applyPaginationState(
    state: Partial<StateType>,
    numberOfDots: number
  ): void {
    this.setState(state)
    this.setState(this.numOfSlidesState(numberOfDots))
  }

  private canCreateDots(
    isDotsRenderable: boolean,
    templateDot?: HTMLElement
  ): templateDot is HTMLElement {
    return isDotsRenderable && !!templateDot
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

    Array.from(existingDots).forEach(dot => removeElement(dot))
  }

  private setInitialActiveDot(): void {
    const allDots = this.getExistingDots()

    allDots.forEach((dot, index) => {
      this.toggleDotState(dot, index === 0)
    })
  }

  private toggleDotState(dot: HTMLElement, isActive: boolean): void {
    if (isActive) {
      this.activateDot(dot)
      return
    }

    this.deactivateDot(dot)
  }

  private activateDot(dot: HTMLElement): void {
    addClass([dot], CLASS_VALUES.SELECTED)
    addClass([dot], DOM_ELEMENT_ALIASES.DOT_ACTIVE[0])
  }

  private deactivateDot(dot: HTMLElement): void {
    removeClass(dot, [CLASS_VALUES.SELECTED, DOM_ELEMENT_ALIASES.DOT_ACTIVE[0]])
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

  private eventMount(): void {
    const { dots: isDotsEnabled } = this.store
    const dotElements = this.getDotElements()

    if (!isDotsEnabled) return
    if (!this.containerDots) return

    this.bindDotEvents(dotElements)
  }

  private getDotElements(): NodeListOf<HTMLElement> {
    return getAllElements<HTMLElement>(TAGS.LI, this.containerDots)
  }

  private bindDotEvents(dotElements: NodeListOf<HTMLElement>): void {
    this.forEachDot(dotElements, (dot, index) => this.handleClick(dot, index))
  }

  private forEachDot(
    dotElements: NodeListOf<HTMLElement>,
    callback: (dot: HTMLElement, index: number) => void
  ): void {
    dotElements.forEach((dot, index) => callback(dot, index))
  }

  private getDotTargetIndex(dotIndex: number): number {
    const { slidesPerPage, slidesPerView, useLoop } = this.store
    const realSlides = this.getRealSlides()
    const totalSlides = realSlides.length
    const step = this.getStepSize(slidesPerPage)

    if (useLoop) return this.getLoopDotTargetIndex(dotIndex, step, totalSlides)

    return this.getPagedDotTargetIndex(
      step,
      slidesPerView,
      totalSlides,
      dotIndex
    )
  }

  private getRealSlides(): HTMLElement[] {
    return this.slides.filter(slide => !hasClass(slide, CLASS_VALUES.CLONED))
  }

  private getStepSize(slidesPerPage: number | undefined): number {
    return slidesPerPage || 1
  }

  private getLoopDotTargetIndex(
    dotIndex: number,
    step: number,
    totalSlides: number
  ): number {
    const cyclicTargetIndex = Math.min(dotIndex * step, totalSlides - 1)

    return cyclicTargetIndex + this.slider.getInitialIndexFromClones()
  }

  private getPagedDotTargetIndex(
    step: number,
    slidesPerView: number,
    totalSlides: number,
    dotIndex: number
  ): number {
    const view = slidesPerView || 1
    const maxStartIndex = Math.max(totalSlides - view, 0)
    const positions = this.getPagedPositions(step, maxStartIndex)

    return positions[dotIndex] ?? maxStartIndex
  }

  private getPagedPositions(step: number, maxStartIndex: number): number[] {
    const positions: number[] = []

    for (let pos = 0; pos <= maxStartIndex; pos += step) positions.push(pos)
    if (!positions.includes(maxStartIndex)) positions.push(maxStartIndex)

    return positions
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
