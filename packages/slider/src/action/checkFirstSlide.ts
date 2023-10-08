import { setStyle } from "@/dom/methods/setStyle"
import { checkFirstSlideCloned } from "@/action/checkSlideCloned"
import { STYLES, slideNodeList } from "@/util/constants"

export function checkFirstSlide($root: string, $children: HTMLElement): void {
  checkFirstSlideCloned($root, slideNodeList($root))
  // setStyle($children, STYLES.TRANSITION, "")
}
