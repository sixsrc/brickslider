import { setRealFirstSlide } from "@/action/setRealFirstSlide"
import { getChildren } from "@/core/functions/getChildren"
import { CLASS_VALUES } from "@/util/constants"
import { isFirstSlideCloned } from "./isFirstSlideCloned"
import { hasClass } from "@/dom/methods/hasClass"

export const firstSlideCallback = (rootSelector: string, slide: HTMLElement[]) => {
  const element = [getChildren(rootSelector)]
  const [isSlideCloned, isActiveClass, firstSlide] = [
    [getChildren(rootSelector)].length > 0 ? isFirstSlideCloned(element[0]) : false,
    hasClass(slide[0], CLASS_VALUES.ACTIVE),
    slide[0]
  ]
  isSlideCloned && isActiveClass && setRealFirstSlide(rootSelector, firstSlide)
}
