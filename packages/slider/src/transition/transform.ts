import { setTransform } from "../dom/methods/setTransform"
import { setTranslateX } from "../action/setTranslateX"
import { getChildren } from "../core/functions/getChildren"

export function transform($root: string, currentTranslateFixedValue?: number) {
  const slider = getChildren($root)

  const setTranslateXCallback = () => setTranslateX($root, currentTranslateFixedValue!)

  setTransform(slider, setTranslateXCallback)
}
