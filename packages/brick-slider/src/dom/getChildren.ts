import { $ } from "../util"
import { childrenSelector } from "../util/constants"

export function getChildren(rootSelector: string): HTMLElement {
  return $(`${rootSelector} ${childrenSelector}`)
}
