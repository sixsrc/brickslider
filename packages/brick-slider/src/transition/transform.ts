import { setTranslateX } from "@/action"
import { getChildren, setTransform } from "@/dom"

export function transform($root: string, currentTranslateFixedValue?: number) {
  const slider = getChildren($root)

  const setTranslateXCallback = () =>
    setTranslateX($root, currentTranslateFixedValue!)

  setTransform(slider, setTranslateXCallback)
}
