import { checkFirstSlideCloned } from "@/event/Touch/functions/checkFirstSlideCloned"
import { slideNodeList } from "@/util/constants"

export function checkFirstSlide($root: string, $children: HTMLElement): void {
  checkFirstSlideCloned($root, slideNodeList($root))
  //setStyle($children, STYLES.TRANSITION, "")
}
