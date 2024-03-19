import { setIndexBypass } from "./setIndexBypass"

export function calcIndex(
  infinite: boolean,
  i: number,
  numberOfSlides: number,
  slidesPerPage: number
) {
  let index: number
  let sliderCount: number

  if (infinite) {
    index = setIndexBypass(i, numberOfSlides, slidesPerPage) + 1
    sliderCount = numberOfSlides - 2
  }

  index = i + 1
  sliderCount = numberOfSlides

  return { index, sliderCount }
}
