import { setTransform } from "../dom/methods/setTransform"
import { setTranslateX } from "../action/setTranslateX"
import { getChildren } from "../core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"
import { State, State_Keys } from "@/state/BrickState"
import { STYLES } from "@/util/constants"

export function transform(rootSelector: string, currentTranslateFromTouch?: number) {
  const slider = getChildren(rootSelector),
    state = new State(rootSelector),
    setTranslateXCallback = () => setTranslateX(rootSelector, currentTranslateFromTouch),
    isLoadPage = state.get(State_Keys.LoadPage)

  !isLoadPage && setStyle(slider, STYLES.TRANSITION, "transform 0.5s ease")
  setTransform(slider, setTranslateXCallback)
}
