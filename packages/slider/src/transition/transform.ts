import { setTransform } from "../dom/methods/setTransform"
import { setTranslateX } from "../action/setTranslateX"
import { getChildren } from "../core/functions/getChildren"

export function transform(rootSelector: string, currentTranslateFromTouch?: number) {
  const slider = getChildren(rootSelector)
  const setTranslateXCallback = () => setTranslateX(rootSelector, currentTranslateFromTouch)

  setTransform(slider, setTranslateXCallback)
}
