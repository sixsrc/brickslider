import { setInnerHTML } from "../dom/methods/setInnerHTML";
import { setSliderAttributes } from "./setSliderAttributes";

export function setAcessibilitySlider(
  numberOfSlides: number | undefined,
  containerSlider: HTMLElement,
  clonedSlider: HTMLElement[]
): void {
  for (let i = 0; i < numberOfSlides!!; i++) {
    const clonedSlide = containerSlider.children[i].cloneNode(
      true
    ) as HTMLElement;

    setSliderAttributes(clonedSlide, {
      "aria-hidden": "true",
      role: "presentation",
      //"data-index": i,
    });
    clonedSlider.push(clonedSlide);
  }
  setInnerHTML(containerSlider, "");
}
