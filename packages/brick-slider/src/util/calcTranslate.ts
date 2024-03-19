import { getSliderWidth } from "@/dom/getSliderWidth"

export function calcTranslate(
  $children: HTMLElement,
  slideSpacing: number,
  slidePosition: number
): number {
  const marginDiference = slidePosition * slideSpacing
  const sliderWidth = getSliderWidth($children)
  const translate = -(sliderWidth * slidePosition + marginDiference)

  return translate
}
