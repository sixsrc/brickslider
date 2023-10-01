import { matchStateOptions } from "@/util/matchStateOptions"
import { setInnerHTML } from "../dom/methods/setInnerHTML"
import { setSliderAttributes } from "./setSliderAttributes"
import { State, State_Keys } from "@/state/BrickState"
import { slideIndexBypass } from "@/core/functions/slideIndexBypass"

export function setAcessibilitySlider(
  $root: string,
  $children: HTMLElement,
  numberOfSlides: number | undefined,
  clonedSlider: HTMLElement[]
): void {
  if (numberOfSlides) {
    for (let i = 0; i < numberOfSlides; i++) {
      const clonedSlide = $children.children[i].cloneNode(true) as HTMLElement
      const state = new State($root)
      const isInfinite = state.get(State_Keys.Infinite)

      const index = isInfinite ? slideIndexBypass(i, numberOfSlides) + 1 : i + 1
      const numberSlides = isInfinite ? numberOfSlides - 2 : numberOfSlides

      setSliderAttributes(clonedSlide, {
        "aria-label": `slide ${index} of ${numberSlides}`,
        "aria-hidden": "true",
        role: "group"
      })
      clonedSlider.push(clonedSlide)
    }
  }
  setInnerHTML($children, "")
}
