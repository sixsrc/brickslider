import { $ } from "../util"
import { trackSelector } from "../util/constants"

export function getTrackChildren(rootSelector: string): HTMLElement {
  return $(`${rootSelector} ${trackSelector}`)
}
