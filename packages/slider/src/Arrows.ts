import { BaseSlider } from "./BaseSlider"
import { Slider } from "./Slider"
import { state, StateType } from "./State"
import { ATTRIBUTES, DOM_ELEMENTS, EVENTS, TIMES } from "./constants"
import { getElementAttribute, listener } from "./helpers"
import { IndexData, IndexKey } from "./types"

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
    const buttons = Array.from(
      document.querySelectorAll(`${this.$root} ${DOM_ELEMENTS.BRICK_ARROWS}`)
    )

    buttons.forEach(button => {
      const handler = () => {
        // Atualiza o dot imediatamente
        //this.updateDotInstant(button)

        // Movimenta o slider apenas após o delay
        setTimeout(() => {
          this.updateClickSpeed()
        }, this.setTime())
      }

      listener([EVENTS.CLICK], button, () =>
        this.arrowHandler(button, this.$root)
      )
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
    const isAtEnd =
      this.store[state.activePage] >= this.store[state.numberOfPages] - 1
    const hasRemainingSlides = this.hasRemaining(totalSlides)
    const isFast = !!this.store["isFastNavigation"]
    return isAtEnd && hasRemainingSlides && isFast
  }

  private arrowHandler(button: Element, $root: string): void {
    const { slideIndex } = this.store
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const eventType = getAttribute === "prev" ? "prev" : "next"
    const slideMovement = eventType === "next" ? "increment" : "decrement"

    this.setState({
      currentSlideMovement: slideMovement
    })

    this.movement = true
    this.setState(this.startPosState())
    this.setState({ prevSlideIndex: slideIndex, currentEventType: eventType })

    this.slider.setSlideTarget({ $root, from: eventType })
  }

  /** Atualiza apenas o dot, sem mover o slider */
  private updateDotInstant(button: Element) {
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const eventType = getAttribute === "prev" ? "prev" : "next"
    const { dotIndex, numberOfPages, infinite } = this.store

    let newDotIndex = dotIndex ?? 0
    if (eventType === "next") newDotIndex++
    else newDotIndex--

    if (newDotIndex > numberOfPages - 1) return

    if (newDotIndex < 0) newDotIndex = numberOfPages - 1
    if (newDotIndex > numberOfPages - 1) {
      newDotIndex = 0
    }

    this.setState({ dotIndex: newDotIndex })

    // Atualiza visualmente os dots imediatamente
    this.slider.updateDots(this.$root)
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

  private slideState(
    indexes: Record<IndexKey, number>,
    indexData: IndexData
  ): Partial<StateType> {
    const { slideIndex } = this.store
    const { currentIndex, translate } = indexData

    return {
      prevSlideIndex: slideIndex,
      slideIndex: indexes[currentIndex],
      prevTranslate: translate,
      currentTranslate: translate
    }
  }

  private startPosState(): Partial<StateType> {
    return {
      startPos: Infinity
    }
  }
}
