import { getRootSelector, prependChild } from "@/dom"

export function appendArrowButtons(buttons: HTMLElement[], selector: string) {
  const $root = getRootSelector(selector)
  buttons.forEach(button => {
    prependChild($root, button)
  })

  return buttons
}
