import { CLASS_VALUES, TAGS } from "../util/constants"
import { getAllElements } from "../dom/methods/getAllElements"
import { hasClass } from "../dom/methods/hasClass"
import { removeClass } from "../dom/methods/removeClass"
import { addClass } from "../dom/methods/addClass"
import { getDotsSelector } from "../core/functions/getDotsSelector"

export function updateDots(index: number, rootSelector: string): void {
  const dots = getAllElements<HTMLElement>(TAGS.LI, getDotsSelector(rootSelector))
  const selectedIndex = index ?? 0

  dots.forEach((dot, i) => {
    if (hasClass(dot, CLASS_VALUES.SELECTED)) {
      removeClass(dot, CLASS_VALUES.SELECTED)
    }
    if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
  })
}
