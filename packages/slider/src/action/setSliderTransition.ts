import { State_Keys } from "@/state/BrickState"
import { listener } from "@/util"
import { EVENTS } from "@/util/constants"
import { matchStateOptions } from "@/util/matchStateOptions"
import { getChildren } from "dist/src/core/functions/getChildren"

export function setSliderTransition(rootSelector: string) {
  const slide = getChildren(rootSelector)

  matchStateOptions(State_Keys.Infinite, { [State_Keys.Infinite]: true }, () => {
    listener(EVENTS.TRANSITIONEND, slide, () => {})
  })
}
