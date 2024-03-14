import { getRootSelector, prependChild } from "@/dom"

export function appendButtons(buttons: HTMLElement[], selector: string) {
  const $root = getRootSelector(selector)
  buttons.forEach(button => {
    prependChild($root, button)
  })

  return buttons
}
