import { DOM_ELEMENTS } from "@/util/constants"
import { getAllElements } from "./getAllElements"
import { getChildren } from "./getChildren"

export function getSlideNodeList($root: string) {
  return Array.from(
    getAllElements<HTMLElement>(
      `${DOM_ELEMENTS.CHILDREN_SELECTOR} > *`,
      getChildren($root)
    )
  )
}
