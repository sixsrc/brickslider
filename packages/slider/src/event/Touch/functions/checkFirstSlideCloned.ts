import { setRealFirstSlide } from "@/action/setRealFirstSlide"
import { getChildren } from "@/core/functions/getChildren"
import { CLASS_VALUES } from "@/util/constants"
import { isFirstSlideCloned } from "./isFirstSlideCloned"
import { hasClass } from "@/dom/methods/hasClass"

export function checkFirstSlideCloned($root: string, slide: HTMLElement[]): void {
  const element = [getChildren($root)]
  const isSlideCloned = [getChildren($root)].length > 0 ? isFirstSlideCloned(element[0]) : false
  const isActiveClass = hasClass(slide[0], CLASS_VALUES.ACTIVE)
  const firstSlide = slide[0]

  isSlideCloned && isActiveClass && setRealFirstSlide($root, firstSlide)
}
