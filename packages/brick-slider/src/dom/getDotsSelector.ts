import { $ } from "@/util/$"
import { DOM_ELEMENTS } from "@/util/constants"

export function getDotsSelector($root: string): HTMLElement {
  return $(`${$root} ${DOM_ELEMENTS.DOTS_SELECTOR}`)
}
