import { $ } from "../util"

export function getRootSelector($root: string): HTMLElement {
  return $(`${$root}`)
}
