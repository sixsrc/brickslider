import { $ } from "../util"
import { dotsSelector } from "../util/constants"

export function getDotsSelector($root: string): HTMLElement {
  return $(`${$root} ${dotsSelector}`)
}
