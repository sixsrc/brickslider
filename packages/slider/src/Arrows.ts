import { BaseSlider } from "./BaseSlider"
import { ArrowSync } from "./ArrowSync"
import { Slider } from "./Slider"
import type {
  NavigationDirection,
  StateType,
  UpdateSlideIndexType
} from "./types"
import { DOM_ELEMENT_ALIASES, EVENTS, FROM, TIMES } from "./helpers"
import {
  getAllElements,
  getSlideMovement,
  getRootSelector,
  hasClass,
  listener
} from "./helpers"

export class Arrows extends BaseSlider {
  public $root: string
  private slider: Slider
  private lastTouchArrowTimestamp = 0

  constructor($root: string) {
    super($root)
    this.$root = $root
    this.slider = new Slider(this.$root)
  }

  public init(): void {
    const buttons = this.getArrowButtons()

    this.bindArrowEvents(buttons)
    new ArrowSync(this.$root).sync()
  }

  private getArrowButtons(): NodeListOf<HTMLElement> {
    const arrowSelector = DOM_ELEMENT_ALIASES.ARROW.map(
      className => `${this.$root} .${className}`
    ).join(", ")

    return getAllElements<HTMLElement>(arrowSelector)
  }

  private bindArrowEvents(buttons: NodeListOf<HTMLElement>): void {
    this.forEachButton(buttons, button => {
      listener([EVENTS.POINTERDOWN], button, (event: Event) =>
        this.handleArrowPointerDown(event as PointerEvent, button)
      )
      listener([EVENTS.CLICK], button, (event: Event) =>
        this.handleArrowClick(event as MouseEvent, button)
      )
    })
  }

  private handleArrowPointerDown(
    event: PointerEvent,
    button: HTMLElement
  ): void {
    const isTouchPointer =
      event.pointerType === "touch" || event.pointerType === "pen"

    if (!isTouchPointer) return

    event.preventDefault()
    this.lastTouchArrowTimestamp = Date.now()
    this.handleArrowInteraction(button)
  }

  private handleArrowClick(event: MouseEvent, button: HTMLElement): void {
    if (this.shouldIgnoreSyntheticTouchClick(event)) return

    this.handleArrowInteraction(button)
  }

  private shouldIgnoreSyntheticTouchClick(event: MouseEvent): boolean {
    const hasRecentTouchArrow =
      Date.now() - this.lastTouchArrowTimestamp < TIMES.DEFAULT_TRANSITION_TIME

    if (!hasRecentTouchArrow) return false

    event.preventDefault()
    return true
  }

  private handleArrowInteraction(button: HTMLElement): void {
    const targetButton = button as HTMLButtonElement

    if (targetButton.disabled) return

    this.arrowHandler(button, this.$root)
  }

  private getArrowEventType(button: Element): NavigationDirection {
    const explicitType = this.getExplicitArrowType(button)

    if (explicitType) return explicitType

    return this.getFallbackArrowType(button)
  }

  private getExplicitArrowType(
    button: Element
  ): NavigationDirection | undefined {
    if (this.matchesArrowClass(button, DOM_ELEMENT_ALIASES.ARROW_PREV)) {
      return FROM.PREV
    }

    if (this.matchesArrowClass(button, DOM_ELEMENT_ALIASES.ARROW_NEXT)) {
      return FROM.NEXT
    }
  }

  private matchesArrowClass(
    button: Element,
    classNames: readonly string[]
  ): boolean {
    return classNames.some(className =>
      hasClass(button as HTMLElement, className)
    )
  }

  private getFallbackArrowType(button: Element): NavigationDirection {
    const scopedButtons = this.getScopedArrowButtons()
    const buttonIndex = this.getArrowButtonIndex(scopedButtons, button)

    return buttonIndex <= 0 ? FROM.PREV : FROM.NEXT
  }

  private getScopedArrowButtons(): Element[] {
    const root = getRootSelector(this.$root)

    if (!root) return []

    const arrowSelector = DOM_ELEMENT_ALIASES.ARROW.map(
      className => `.${className}`
    ).join(", ")

    return Array.from(getAllElements<Element>(arrowSelector, root))
  }

  private getArrowButtonIndex(
    scopedButtons: Element[],
    button: Element
  ): number {
    return scopedButtons.indexOf(button)
  }

  private arrowHandler(button: Element, $root: string): void {
    const { slideIndex, useDragFree } = this.store
    const eventType = this.getArrowEventType(button)

    if (useDragFree) {
      this.handleFreeArrowNavigation(slideIndex, eventType)

      return
    }

    this.handlePagedArrowNavigation(slideIndex, $root, eventType)
  }

  private applyArrowNavigationState(
    slideIndex: number,
    eventType: NavigationDirection
  ): void {
    const slideMovement = this.getArrowSlideMovement(eventType)
    const navigationState = this.getArrowNavigationState(slideIndex, eventType)

    this.applyArrowSlideMovementState(slideMovement)
    this.applyArrowStartPosState()
    this.applyArrowNavigationTargetState(navigationState)
  }

  private getArrowSlideMovement(
    eventType: NavigationDirection
  ): UpdateSlideIndexType {
    return getSlideMovement(eventType)
  }

  private getArrowNavigationState(
    slideIndex: number,
    eventType: NavigationDirection
  ): Partial<StateType> {
    return {
      prevSlideIndex: slideIndex,
      currentEventType: eventType
    }
  }

  private applyArrowSlideMovementState(
    slideMovement: UpdateSlideIndexType
  ): void {
    this.setState({
      currentSlideMovement: slideMovement
    })
  }

  private applyArrowStartPosState(): void {
    const startPosState = this.startPosState()

    this.setState(startPosState)
  }

  private applyArrowNavigationTargetState(
    navigationState: Partial<StateType>
  ): void {
    this.setState(navigationState)
  }

  private runFreeArrowNavigation(eventType: NavigationDirection): void {
    this.slider.goToFreeDirection(eventType)
  }

  private runPagedArrowNavigation(
    $root: string,
    eventType: NavigationDirection
  ): void {
    this.slider.setSlideTarget({ $root, from: eventType })
  }

  private handleFreeArrowNavigation(
    slideIndex: number,
    eventType: NavigationDirection
  ): void {
    this.applyArrowNavigationState(slideIndex, eventType)
    this.runFreeArrowNavigation(eventType)
  }

  private handlePagedArrowNavigation(
    slideIndex: number,
    $root: string,
    eventType: NavigationDirection
  ): void {
    this.applyArrowNavigationState(slideIndex, eventType)
    this.runPagedArrowNavigation($root, eventType)
  }

  protected evalSlideConditions(): Record<string, boolean> {
    const { slideIndex, slidesPerPage } = this.store
    const isFirstCloned = slideIndex === 0
    const penultIndex = Math.ceil(this.childrenCount / slidesPerPage) - 1
    const isLastCloned = slideIndex === penultIndex

    return {
      FIRST: isFirstCloned,
      LAST: isLastCloned
    }
  }

  private startPosState(): Partial<StateType> {
    return {
      startPos: Infinity
    }
  }
}
