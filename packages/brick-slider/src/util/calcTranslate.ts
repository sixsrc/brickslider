import { getSliderWidth } from "@/dom/getSliderWidth"

export function calcTranslate(
  $children: HTMLElement,
  slideSpacing: number,
  slidePosition: number
): number {
  const marginDiference = slidePosition * slideSpacing,
    sliderWidth = getSliderWidth($children),
    translate = -(sliderWidth * slidePosition + marginDiference)

  return translate
}
