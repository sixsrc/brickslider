import { getChildren } from "@/core/functions/getChildren"
import { setStyle } from "@/dom/methods/setStyle"
import { STYLES } from "@/util/constants"

export function updateSliderTransition(rootSelector: string, transition: string) {
  const slider = getChildren(rootSelector)
  setStyle(slider, STYLES.TRANSITION, transition)
}
