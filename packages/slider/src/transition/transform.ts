import { setTransform } from "../dom/methods/setTransform"
import { setTranslateX } from "../action/setTranslateX"
import { getChildren } from "../core/functions/getChildren"
//import { State, /*State_Keys*/ } from "@/state/BrickState"
import { updateSliderTransition } from "@/action/updateSliderTransition"
import { listener } from "@/util"
import { EVENTS } from "@/util/constants"
import { State_Keys } from "@/state/BrickState"
//import { setStyle } from "@/dom/methods/setStyle"
//import { STYLES } from "@/util/constants"

export function transform(rootSelector: string, currentTranslateFromTouch?: number) {
  const slider = getChildren(rootSelector),
    //state = new State(rootSelector),
    setTranslateXCallback = () => setTranslateX(rootSelector, currentTranslateFromTouch)
  // isLoadPage = state.get(State_Keys.LoadPage)

  ///updateSliderTransition(rootSelector, "transform cubic-bezier(0.25, 1, 0.5,1)")

  setTransform(slider, setTranslateXCallback)
}
