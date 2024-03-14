import { DOM_ELEMENTS } from "@/util/constants"
import { $ } from "../util"

export function getTrackSlider(rootSelector: string): HTMLElement {
  const trackSelector = DOM_ELEMENTS.TRACK_SELECTOR
  return $(`${rootSelector} ${trackSelector}`)
}
