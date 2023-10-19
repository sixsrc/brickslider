import { getChildren } from "@/core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"
import { checkSlideCloned } from "@/action/checkSlideCloned"
import { cancelWait, waitFor } from "@/util"
import { STYLES, TIMES, slideNodeList } from "@/util/constants"
import { State, State_Keys } from "@/state/BrickState"

export const checkSlide = ($root: string, isInfinite: boolean) => {
  const state = new State($root)

  const $children = getChildren($root)

  //const time = 300

  const slides = slideNodeList($root)

  if (isInfinite) {
    setStyle($children, STYLES.TRANSITION, "")
    checkSlideCloned($root, slides)
    /* const wait = waitFor(300, () => {
      cancelWait(wait)
    })*/
  }
}
