import { CLASS_VALUES, TAGS } from "../util/constants"
import { getAllElements } from "../dom/getAllElements"
import { hasClass } from "../dom/hasClass"
import { removeClass } from "../dom/removeClass"
import { addClass } from "../dom/addClass"
import { getDotsSelector } from "../dom/getDotsSelector"

export function updateDots(index: number, rootSelector: string): void {
  const dots = getAllElements<HTMLElement>(
    TAGS.LI,
    getDotsSelector(rootSelector)
  )
  const selectedIndex = index ?? 0

  console.log("index update dots", selectedIndex)

  dots.forEach((dot, i) => {
    if (hasClass(dot, CLASS_VALUES.SELECTED))
      removeClass(dot, CLASS_VALUES.SELECTED)

    if (i === selectedIndex) addClass([dot], CLASS_VALUES.SELECTED)
  })
}
