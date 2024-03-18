import { $ } from "@/util/$"
import { DOM_ELEMENTS } from "@/util/constants"

export function getTrackChildren(rootSelector: string): HTMLElement {
  return $(`${rootSelector} ${DOM_ELEMENTS.TRACK_SELECTOR}`)
}
