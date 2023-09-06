import { setInnerHTML } from "../dom/methods/setInnerHTML"
import { setSliderAttributes } from "./setSliderAttributes"

export function setAcessibilitySlider(
  numberOfSlides: number | undefined,
  containerSlider: HTMLElement,
  clonedSlider: HTMLElement[]
): void {
  if (numberOfSlides) {
    for (let i = 0; i < numberOfSlides; i++) {
      const clonedSlide = containerSlider.children[i].cloneNode(
        true
      ) as HTMLElement

      setSliderAttributes(clonedSlide, {
        "aria-hidden": "true",
        role: "presentation"
      })
      clonedSlider.push(clonedSlide)
    }
  }
  setInnerHTML(containerSlider, "")
}
