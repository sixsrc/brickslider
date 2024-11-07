import { HandleMovement } from "./HandleMovement"
import { Slider } from "./Slider"
import { StateType } from "./State"
import { ATTRIBUTES, DOM_ELEMENTS, EVENTS, TAGS } from "./constants"
import {
  addClass,
  createNewElement,
  getElementAttribute,
  listener,
  prependChild,
  setAttribute,
  setInnerHTML,
  waitFor
} from "./helpers"
import { IndexData, IndexKey, IndexMap } from "./types"

export class Arrows extends HandleMovement {
  public $root: string
  private slider: Slider
  private buttons: HTMLElement[] = []

  constructor($root: string) {
    super($root)
    this.$root = $root
    this.slider = new Slider(this.$root)
  }

  public init(): void {
    const createButtons = this.createButtons(2)
    const buttons = this.appendButtons(createButtons)

    buttons.forEach(button => {
      listener([EVENTS.CLICK], button, () => {
        this.arrowHandler(button, this.$root)
      })
    })
  }

  private createButtons(numberOfButtons: number): HTMLElement[] {
    for (let i = 0; i < numberOfButtons; i++) {
      const button = createNewElement(TAGS.BUTTON)
      const isGreaterThanZero = i === 0
      const attr = isGreaterThanZero ? "next" : "prev"

      setAttribute(button, ATTRIBUTES.DIRECTION, attr)

      addClass([button], DOM_ELEMENTS.BRICK_ARROWS)

      setInnerHTML(button, isGreaterThanZero ? "next" : "prev")

      this.buttons.push(button)
    }

    return this.buttons
  }

  private appendButtons(buttons: HTMLElement[]): HTMLElement[] {
    buttons.forEach(button => {
      prependChild(this.getRootSelector, button)
    })

    return buttons
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

    this.handleMove()

    this.setState({ prevSlideIndex: slideIndex, currentEventType })

    this.slider.setSlideTarget({ $root })
  }

  protected jumpSlideTo(to: keyof IndexMap): void {
    const indexData = this.mapIndex().get(to)

    if (indexData) {
      const indexes = this.getIndexes()

      this.setState(this.slideState(indexes, indexData))

      this.animate(this.$children, this.keyFrames(), this.options(0))

      this.waitForAction()
    }
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

  private waitForAction(): void {
    const action = () => {
      this.setState(this.jumpSlideState(false))
    }

    waitFor(0, action)
  }

  private slideState(
    indexes: Record<IndexKey, number>,
    indexData: IndexData
  ): Partial<StateType> {
    const { slideIndex } = this.store
    const { currentIndex, translate } = indexData

    return {
      isJumpSlide: true,
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

  private jumpSlideState(c: boolean): Partial<StateType> {
    return { isJumpSlide: c }
  }
}

/*
private handleMove(): void {
    const { infinite, slidesPerPage } = this.store
    infinite && slidesPerPage <= 1 && this.infiniteMove()
  }
  private mapIndex(): Map<IndexKey, IndexData> {
    const penultIndex = this.calcTranslate(this.childrenCount - 2)
    const secondIndex = this.calcTranslate(1)
    const { FIRST, LAST } = SLIDE_INDEX

    return new Map([
      [FIRST, { currentIndex: LAST, translate: penultIndex }],
      [LAST, { currentIndex: FIRST, translate: secondIndex }]
    ])
  }

   private infiniteMove(): void {
    const isEqual = Object.keys(this.evalSlideConditions()).find(
      key => this.evalSlideConditions()[key]
    )

    if (isEqual) {
      this.jumpSlideTo(SLIDE_INDEX[isEqual as keyof typeof SLIDE_INDEX])
    }
  }


*/
