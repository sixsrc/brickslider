import { getChildren } from "@/dom/getChildren"
import { setTransform } from "@/dom/setTransform"
import { setTranslateX } from "@/util"

export function transform($root: string, currentTranslateFixed?: number) {
  const slider = getChildren($root)

  const callback = () => setTranslateX($root, currentTranslateFixed!)

  setTransform(slider, callback)
}
