import { BaseSlider } from "./BaseSlider"

import { Slider } from "./Slider"
import { StateType } from "./State"
import { ATTRIBUTES, DOM_ELEMENTS, EVENTS } from "./constants"
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
      const debouncedHandler = this.debounce(() => {
        this.arrowHandler(button, this.$root)
      }, 0) // Define o tempo de debounce

      listener([EVENTS.CLICK], button, debouncedHandler)
    })
  }

  private debounce(func: Function, delay: number): (...args: any[]) => void {
    let timer: NodeJS.Timeout | null = null

    return (...args: any[]) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => func(...args), delay)
    }
  }

  private arrowHandler(button: Element, $root: string): void {
    const { slideIndex } = this.store
    const getAttribute = getElementAttribute(button, ATTRIBUTES.DIRECTION)
    const eventType = getAttribute === "prev" ? "prev" : "next"
    const slideMovement = eventType === "next" ? "increment" : "decrement"
    const currentEventType = eventType

    this.setState({ currentSlideMovement: slideMovement })

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
