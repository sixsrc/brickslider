import { BaseSlider } from "./BaseSlider"
import {
  ATTRIBUTES,
  DOM_ELEMENT_ALIASES,
  FROM,
  NavigationDirection,
  getAllElements,
  getRootSelector,
  hasClass,
  removeAttribute,
  setAttribute
} from "./helpers"

export class ArrowSync extends BaseSlider {
  public sync(): void {
    const buttons = this.getArrowButtons()

    this.forEachButton(buttons, button => {
      const eventType = this.getArrowEventType(button)
      const isDisabled = this.isArrowDisabled(eventType)

      this.setArrowDisabledState(button, isDisabled)
    })
  }

  private getArrowButtons(): NodeListOf<HTMLElement> {
    const arrowSelector = DOM_ELEMENT_ALIASES.ARROW.map(
      className => `${this.$root} .${className}`
    ).join(", ")

    return getAllElements<HTMLElement>(arrowSelector)
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
    const buttonIndex = scopedButtons.indexOf(button)

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

  private isArrowDisabled(eventType: NavigationDirection): boolean {
    const {
      useLoop,
      useDragFree,
      activePage,
      numberOfPages,
      currentTranslate,
      sliderWidth
    } = this.store

    if (useLoop) return false

    if (useDragFree) {
      const maxTranslate = Math.max(
        0,
        this.getTotalWidth() - (sliderWidth ?? this.sliderWidth ?? 0)
      )
      const safeTranslate = Math.abs(currentTranslate ?? 0)
      const isPrevDisabled = safeTranslate <= 0
      const isNextDisabled = safeTranslate >= maxTranslate - 1

      return eventType === FROM.PREV ? isPrevDisabled : isNextDisabled
    }

    const safePages = Math.max(1, numberOfPages || 0)
    const safePage = Math.max(0, Math.min(activePage || 0, safePages - 1))
    const isPrevDisabled = safePage === 0
    const isNextDisabled = safePage === safePages - 1

    return eventType === FROM.PREV ? isPrevDisabled : isNextDisabled
  }

  private setArrowDisabledState(
    button: HTMLButtonElement | HTMLElement,
    isDisabled: boolean
  ): void {
    const targetButton = button as HTMLButtonElement

    if (isDisabled) {
      targetButton.disabled = true
      setAttribute(button, ATTRIBUTES.ARIA_DISABLED, "true")
      return
    }

    targetButton.disabled = false
    removeAttribute(button, ATTRIBUTES.DISABLED)
    setAttribute(button, ATTRIBUTES.ARIA_DISABLED, "false")
  }
}
