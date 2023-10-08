import { getChildren } from "@/core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"
import { checkSlideCloned } from "@/action/checkSlideCloned"
import { cancelWait, waitFor } from "@/util"
import { STYLES, TIMES, slideNodeList } from "@/util/constants"

export const checkSlide = ($root: string, isInfinite: boolean) => {
  const $children = getChildren($root)

  const time = TIMES.DEFAULT_TRANSITION_TIME - 100

  const slides = slideNodeList($root)

  const wait = waitFor(time, () => {
    setStyle($children, STYLES.TRANSITION, "")

    if (isInfinite) checkSlideCloned($root, slides)

    cancelWait(wait)
  })
}
