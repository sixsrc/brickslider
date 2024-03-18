import { $ } from "@/util/$"
import { DOM_ELEMENTS } from "@/util/constants"

export function getChildren(rootSelector: string): HTMLElement {
  return $(`${rootSelector} ${DOM_ELEMENTS.CHILDREN_SELECTOR}`)
}
