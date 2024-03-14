import { ATTRIBUTES, DOM_ELEMENTS, TAGS, FROM } from "@/util/constants"
import { addClass, createNewElement, setAttribute, setInnerHTML } from "@/dom"

export function createButtons(numOfButtons: number): HTMLElement[] {
  const buttons: HTMLElement[] = []

  for (let i = 0; i < numOfButtons; i++) {
    const button = createNewElement(TAGS.BUTTON)
    const isGreaterThanZero = i === 0

    setAttribute(
      button,
      ATTRIBUTES.DIRECTION,
      isGreaterThanZero ? FROM.NEXT : FROM.PREV
    )

    addClass([button], DOM_ELEMENTS.BRICK_ARROWS)

    setInnerHTML(button, isGreaterThanZero ? FROM.NEXT : FROM.PREV)

    buttons.push(button)
  }
  return buttons
}
