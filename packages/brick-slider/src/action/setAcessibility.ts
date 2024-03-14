import { setInnerHTML } from "../dom/setInnerHTML"
import { setAttributes } from "@/action"
import { State, State_Keys } from "@/state/BrickState"
import { slideIndexBypass } from "@/util/"

export function setAcessibility(
  $root: string,
  $children: HTMLElement,
  numberOfSlides: number,
  clonedSlider: HTMLElement[]
): void {
  for (let i = 0; i < numberOfSlides!; i++) {
    const clonedSlide = $children.children[i].cloneNode(true) as HTMLElement
    const state = new State($root)
    const isInfinite = state.get(State_Keys.Infinite)

    const slidesPerPage = state.get(State_Keys.SlidesPerPage)

    const index = isInfinite
      ? slideIndexBypass(i, numberOfSlides, slidesPerPage) + 1
      : i + 1
    const numberSlides = isInfinite ? numberOfSlides - 2 : numberOfSlides

    console.log("clonedSlide", clonedSlide)

    setAttributes(clonedSlide, {
      "aria-label": `slide ${index} of ${numberSlides}`,
      "aria-hidden": "true",
      role: "group"
    })
    clonedSlider.push(clonedSlide)
  }
  setInnerHTML($children, "")
}
