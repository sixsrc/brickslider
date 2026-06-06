import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { DOM_ELEMENT_ALIASES, EVENTS, TIMES } from "./helpers"
import { getRootSelector, hasClass, listener } from "./helpers"

export class Arrows extends BaseSlider {
  public $root: string
  private slider: Slider
  private buttons: HTMLElement[] = []
  private lastClickTimestamps: number[] = []

  constructor($root: string) {
    super($root)
    this.$root = $root
    this.slider = new Slider(this.$root)
  }

  public init(): void {
    const arrowSelector = DOM_ELEMENT_ALIASES.ARROW.map(
      className => `${this.$root} .${className}`
    ).join(", ")

    const buttons = Array.from(document.querySelectorAll(arrowSelector))

    buttons.forEach(button => {
      const handler = () => {
        setTimeout(() => {
          this.updateClickSpeed()
        }, this.setTime())
      }

      listener([EVENTS.CLICK], button, () => {
        handler()
        this.arrowHandler(button, this.$root)
      })
    })
  }

  private updateClickSpeed(): void {
    const now = Date.now()
    this.lastClickTimestamps.push(now)

    if (this.lastClickTimestamps.length > 3) {
      this.lastClickTimestamps.shift()
    }

    if (this.lastClickTimestamps.length >= 3) {
      const deltas = this.lastClickTimestamps
        .slice(1)
        .map((t, i) => t - this.lastClickTimestamps[i])

      const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length

      this.setState({
        isFastNavigation: avgDelta < TIMES.DEFAULT_TRANSITION_TIME - 100
      })
    }
  }

  private setTime(): number {
    const totalSlides = Slider.getSlides(this.$root, false).length
    return this.getTime(totalSlides) ? TIMES.DEFAULT_TRANSITION_TIME - 100 : 0
  }

  private getTime(totalSlides: number): boolean {
    const { activePage, numberOfPages } = this.store
    const isAtEnd = activePage >= numberOfPages - 1
    const hasRemainingSlides = this.hasRemaining(totalSlides)
    const isFast = !!this.store["isFastNavigation"]
    return isAtEnd && hasRemainingSlides && isFast
  }

  private getArrowEventType(button: Element): "prev" | "next" {
    if (
      DOM_ELEMENT_ALIASES.ARROW_PREV.some(className =>
        hasClass(button as HTMLElement, className)
      )
    ) {
      return "prev"
    }

    if (
      DOM_ELEMENT_ALIASES.ARROW_NEXT.some(className =>
        hasClass(button as HTMLElement, className)
      )
    ) {
      return "next"
    }

    const root = getRootSelector(this.$root)
    const scopedButtons =
      root?.querySelectorAll(
        DOM_ELEMENT_ALIASES.ARROW.map(className => `.${className}`).join(", ")
      ) ?? []

    const buttonIndex = Array.from(scopedButtons).indexOf(button)

    return buttonIndex <= 0 ? "prev" : "next"
  }

  private arrowHandler(button: Element, $root: string): void {
    const { slideIndex, useDragFree } = this.store
    const eventType = this.getArrowEventType(button)
    const slideMovement = eventType === "next" ? "increment" : "decrement"
    const navigationState = {
      prevSlideIndex: slideIndex,
      currentEventType: eventType
    }

    this.setState({
      currentSlideMovement: slideMovement
    })

    this.movement = true
    this.setState(this.startPosState())
    this.setState(navigationState)

    if (useDragFree) {
      this.slider.goToFreeDirection(eventType)
      return
    }

    this.slider.setSlideTarget({ $root, from: eventType })
  }

  protected evalSlideConditions(): Record<any, boolean> {
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
