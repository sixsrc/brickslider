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

  constructor($root: string) {
    super($root)
    this.$root = $root
    this.slider = new Slider(this.$root)
  }

  public init(): void {
    const buttons = Array.from(
      document.querySelectorAll(`${this.$root}  ${DOM_ELEMENTS.BRICK_ARROWS}`)
    )

    buttons.forEach(button => {
      const handler = () => {
        setTimeout(() => {
          this.arrowHandler(button, this.$root)
        }, this.setTime())
      }
      listener([EVENTS.CLICK], button, handler)
    })
  }

  private setTime(): number {
    const totalSlides = Slider.getSlides(this.$root, false).length
      ? TIMES.DEFAULT_TRANSITION_TIME - 100
      : 0

    return this.getTime(totalSlides) ? totalSlides : 0
  }

  private getTime(totalSlides: number): boolean {
    return (
      this.store[state.activePage] >= this.store[state.numberOfPages] - 1 &&
      this.hasRemaining(totalSlides)
    )
  }

  private hasMultipleClicks() {
    const times =
      Math.abs(this.store[state.startTime] - this.store[state.endTime]) <= 1
    console.log(
      "caiu na pica",
      Math.abs(this.store[state.startTime] - this.store[state.endTime])
    )
    return times
  }

  private arrowHandler(button: Element, $root: string): void {
    const { slideIndex } = this.store
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const eventType = getAttribute === "prev" ? "prev" : "next"
    const slideMovement = eventType === "next" ? "increment" : "decrement"
    const currentEventType = eventType

    this.setState({
      currentSlideMovement: slideMovement,
      startTime: performance.now()
    })

    this.movement = true

    this.setState(this.startPosState())

    this.setState({ prevSlideIndex: slideIndex, currentEventType })

    this.slider.setSlideTarget({ $root })
  }

  protected evalSlideConditions(): Record<any, boolean> {
    const { slideIndex, slidesPerPage } = this.store
    const isFirstCloned = slideIndex === 0
    const penultIndex = Math.ceil(this.childrenCount / slidesPerPage) - 1
    const isLastCloned = slideIndex === penultIndex //this.childrenCount - 1

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
      //isJumpSlide: true,
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
/*buttons.forEach(button => {
      let time = this.store["activePage"] >= 5 ? 300 : 0
      const debouncedHandler = this.debounce(() => {
        console.log("daime", time)
        this.arrowHandler(button, this.$root)
      }, time) //120) // Define o tempo de debounce

      listener([EVENTS.CLICK], button, debouncedHandler)
    })*/
