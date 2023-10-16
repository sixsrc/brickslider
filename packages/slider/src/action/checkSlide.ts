import { getChildren } from "@/core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"
import { checkSlideCloned } from "@/action/checkSlideCloned"
import { cancelWait, waitFor } from "@/util"
import { STYLES, TIMES, slideNodeList } from "@/util/constants"
import { State } from "@/state/BrickState"

export const checkSlide = ($root: string, isInfinite: boolean) => {
  const state = new State($root)
  const $children = getChildren($root)

  const time = 200

  const slides = slideNodeList($root)

  const wait = waitFor(time, () => {
    setStyle($children, STYLES.TRANSITION, "")

    if (isInfinite) checkSlideCloned($root, slides)

    cancelWait(wait)
  })
}
